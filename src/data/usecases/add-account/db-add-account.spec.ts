import { Hasher, AddAccountModel, AccountModel, AddAccountRepository } from "./db-add-account-protocols"
import { DbAddAccount } from "./db-add-account"


interface SutTypes {
    sut: DbAddAccount,
    hasherSub: Hasher
    addAccountRepositoryStub: AddAccountRepository
}

const makeFakeAccount = (): AccountModel => ({ 
    id: 'valid_id',
    name: 'valid_name',
    email: 'valid_email',
    password: 'hashed_password',
})

const makeFakeAccountData = (): AddAccountModel => ({ 
    name: 'valid_name',
    email: 'valid_email',
    password: 'valid_password',
})


const makeHasher = (): Hasher => {
    class HasherStub implements Hasher {
        async hash(value: string): Promise<string> {
            return new Promise( resolve => resolve('hashed_password'))
        }
    }

    return new HasherStub()
}


const makeAddAccountRepository = (): AddAccountRepository => {
    class AddAccountRepositoryStub implements AddAccountRepository {
        async add( accountData: AddAccountModel ): Promise<AccountModel> {
            return new Promise(resolve => resolve(makeFakeAccount()))
        }
    }
    return new AddAccountRepositoryStub();
}

const makeSut = (): SutTypes => {
    const hasherSub = makeHasher()
    const addAccountRepositoryStub = makeAddAccountRepository()
    const sut = new DbAddAccount(hasherSub, addAccountRepositoryStub)
    
    return {
        sut, 
        hasherSub,
        addAccountRepositoryStub
    }
}

describe('DbAddAccount Usecase', () => {
    test('Shold call Hasher with correct password ', async () => {
        const { sut, hasherSub } = makeSut()
        const hashSpy = jest.spyOn(hasherSub, 'hash')
        await sut.add(makeFakeAccountData())
        expect(hashSpy).toHaveBeenCalledWith('valid_password')
    })

    test('Shold throw Hasher throws', async () => {
        const { sut, hasherSub } = makeSut()
        jest.spyOn(hasherSub, 'hash').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
        const promise = sut.add(makeFakeAccountData())
        await expect(promise).rejects.toThrow()
    })

    test('Shold call AddAccountRepository with correct values ', async () => {
        const { sut, addAccountRepositoryStub } = makeSut()
        const addSpy = jest.spyOn(addAccountRepositoryStub, 'add')
        await sut.add(makeFakeAccountData())
        expect(addSpy).toHaveBeenCalledWith({ 
            name: 'valid_name',
            email: 'valid_email',
            password: 'hashed_password',
        })
    })

    test('Shold throw AddAccountRepository throws', async () => {
        const { sut, addAccountRepositoryStub } = makeSut()
        jest.spyOn(addAccountRepositoryStub, 'add').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
        const promise = sut.add(makeFakeAccountData())
        await expect(promise).rejects.toThrow()
    })

    test('Shold return an account on success', async () => {
        const { sut } = makeSut()
        const account = await sut.add(makeFakeAccountData())
        expect(account).toEqual(makeFakeAccount())
    })

})