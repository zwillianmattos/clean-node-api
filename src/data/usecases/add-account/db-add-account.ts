import { AccountModel,  AddAccount, AddAccountModel,  Encrypter, AddAccountRepository } from "./db-add-account-protocols";

export class DbAddAccount implements AddAccount {
    private readonly encrypter:Encrypter;
    private readonly addAccpimtRepository:AddAccountRepository;
    constructor( encrypter: Encrypter, addAccpimtRepository: AddAccountRepository) {
        this.encrypter = encrypter
        this.addAccpimtRepository = addAccpimtRepository
    }
    
    async add(accountData: AddAccountModel): Promise<AccountModel> {
        const hashedPassword = await this.encrypter.encrypt(accountData.password)
        await this.addAccpimtRepository.add(Object.assign({}, accountData, {password: hashedPassword}))
        return new Promise(resolve => resolve(null))
    }
    
}