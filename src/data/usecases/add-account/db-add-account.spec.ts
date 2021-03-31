import { Encrypter, AddAccountModel, AccountModel, AddAccountRepository } from "./db-add-account-protocols"
import { DbAddAccount } from "./db-add-account"


interface SutTypes {
    sut: DbAddAccount,
    encrypterSub: Encrypter
    addAccountRepositoryStub: AddAccountRepository
}

const makeEncrypter = (): Encrypter => {
    class EncrypterStub implements Encrypter {
        async encrypt(value: string): Promise<string> {
            return new Promise( resolve => resolve('hashed_password'))
        }
    }

    return new EncrypterStub()
}


const makeAddAccountRepository = (): AddAccountRepository => {
    class AddAccountRepositoryStub implements AddAccountRepository {
        async add( accountData: AddAccountModel ): Promise<AccountModel> {
            const fakeAccount = { 
                id: 'valid_id',
                name: 'valid_name',
                email: 'valid_email',
                password: 'hashed_password',
            }
            return new Promise(resolve => resolve(fakeAccount))
        }
    }
    return new AddAccountRepositoryStub();
}

const makeSut = (): SutTypes => {
    const encrypterSub = makeEncrypter()
    const addAccountRepositoryStub = makeAddAccountRepository()
    const sut = new DbAddAccount(encrypterSub, addAccountRepositoryStub)
    
    return {
        sut, 
        encrypterSub,
        addAccountRepositoryStub
    }
}

describe('DbAddAccount Usecase', () => {
    test('Shold call Encrypter with correct password ', async () => {
        const { sut, encrypterSub } = makeSut()
        const encryptSpy = jest.spyOn(encrypterSub, 'encrypt')
        const accountData = { 
            name: 'valid_name',
            email: 'valid_email',
            password: 'valid_password',
        }
        await sut.add(accountData)
        expect(encryptSpy).toHaveBeenCalledWith('valid_password')
    })

    test('Shold throw Encrypter throws', async () => {
        const { sut, encrypterSub } = makeSut()
        jest.spyOn(encrypterSub, 'encrypt').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))

        const accountData = { 
            name: 'valid_name',
            email: 'valid_email',
            password: 'valid_password',
        }
        const promise = sut.add(accountData)
        await expect(promise).rejects.toThrow()
    })

    test('Shold call AddAccountRepository with correct values ', async () => {
        const { sut, addAccountRepositoryStub } = makeSut()
        const addSpy = jest.spyOn(addAccountRepositoryStub, 'add')
        const accountData = { 
            name: 'valid_name',
            email: 'valid_email',
            password: 'valid_password',
        }
        await sut.add(accountData)
        expect(addSpy).toHaveBeenCalledWith({ 
            name: 'valid_name',
            email: 'valid_email',
            password: 'hashed_password',
        })
    })

    test('Shold throw AddAccountRepository throws', async () => {
        const { sut, addAccountRepositoryStub } = makeSut()
        jest.spyOn(addAccountRepositoryStub, 'add').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))

        const accountData = { 
            name: 'valid_name',
            email: 'valid_email',
            password: 'valid_password',
        }
        const promise = sut.add(accountData)
        await expect(promise).rejects.toThrow()
    })

    test('Shold return an account on success', async () => {
        const { sut } = makeSut()

        const accountData = { 
            name: 'valid_name',
            email: 'valid_email',
            password: 'valid_password',
        }
        const account = await sut.add(accountData)
        expect(account).toEqual({ 
            id: 'valid_id', 
            name: 'valid_name',
            email: 'valid_email',
            password: 'hashed_password',
        })
    })

})