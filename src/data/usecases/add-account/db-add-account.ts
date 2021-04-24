import { AccountModel,  AddAccount, AddAccountModel,  Hasher, AddAccountRepository } from "./db-add-account-protocols";

export class DbAddAccount implements AddAccount {
    private readonly hasher:Hasher;
    private readonly addAccpimtRepository:AddAccountRepository;
    constructor( hasher: Hasher, addAccpimtRepository: AddAccountRepository) {
        this.hasher = hasher
        this.addAccpimtRepository = addAccpimtRepository
    }
    
    async add(accountData: AddAccountModel): Promise<AccountModel> {
        const hashedPassword = await this.hasher.hash(accountData.password)
        const account = await this.addAccpimtRepository.add(Object.assign({}, accountData, {password: hashedPassword}))
        return new Promise(resolve => resolve(account))
    }
    
}