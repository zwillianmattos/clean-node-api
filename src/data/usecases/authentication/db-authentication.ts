import {
    Authentication,
    AuthenticationModel,
    HashComparer,
    LoadAccountByEmailRepository,
    Encrypter,
    UpdateAccessTokenRepository
} from "./db-authentication-protocols"


export class DbAuthentication implements Authentication {
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository
    private readonly hashComparer: HashComparer
    private readonly encrypterStub: Encrypter
    private readonly updateAccessTokenRepository: UpdateAccessTokenRepository

    constructor(
        loadAccountByEmailRepository: LoadAccountByEmailRepository,
        hashComparer: HashComparer,
        encrypterStub: Encrypter,
        updateAccessTokenRepository: UpdateAccessTokenRepository
    ) {
        this.loadAccountByEmailRepository = loadAccountByEmailRepository
        this.hashComparer = hashComparer
        this.encrypterStub = encrypterStub
        this.updateAccessTokenRepository = updateAccessTokenRepository
    }

    async auth(authentication: AuthenticationModel): Promise<string> {
        const account = await this.loadAccountByEmailRepository.loadByEmail(authentication.email);
        if (account) {
            const isValid = await this.hashComparer.compare(authentication.password, account.password)
            if (isValid) {
                const accessToken = await this.encrypterStub.encrypt(account.id)
                await this.updateAccessTokenRepository.updateAccessToken(account.id, accessToken)
                return accessToken
            }
        }
        return null
    }
}