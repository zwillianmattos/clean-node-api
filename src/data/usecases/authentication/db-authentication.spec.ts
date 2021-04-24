
import { AccountModel } from "../../../domain/models/account"
import { LoadAccountByEmailRepository } from "../../protocols/load-account-by-email-repository"
import { DbAddAccount } from "../add-account/db-add-account"
import { DbAuthentication } from "./db-authentication"


describe('DbAuthentication UseCase', () => {
    test('Should call LoadAccountByEmailRepository with correct email', async () => {
        class LoadAccounByEmailRepositoryStub implements LoadAccountByEmailRepository {
            async load(email: string): Promise<AccountModel> {
                const account: AccountModel = {
                    id: 'any_id',
                    name: 'any_name',
                    email: 'any_email@mail.com',
                    password: 'any_password'
                }
                return new Promise(resolve => resolve(account))
            }
        }
        const loadAccounByEmailRepositoryStub = new LoadAccounByEmailRepositoryStub()
        const sut = new DbAuthentication(loadAccounByEmailRepositoryStub)
        const loadSpy = jest.spyOn(loadAccounByEmailRepositoryStub, 'load')
        await sut.auth({
            email: 'any_email@mail.com',
            password: 'any_password'
        })

        expect(loadSpy).toHaveBeenCalledWith('any_email@mail.com')
    })

})