import { Encrypter } from "./db-add-account-protocols"
import { DbAddAccount } from "./db-add-account"

import {  } from "./db-add-account-protocols";


interface SutTypes {
    sut: DbAddAccount,
    encrypterSub: Encrypter
}

const makeEncrypter = (): Encrypter => {
    class EncrypterStub implements Encrypter {
        async encrypt(value: string): Promise<string> {
            return new Promise( resolve => resolve('hashed_password'))
        }
    }

    return new EncrypterStub()
}

const makeSut = (): SutTypes => {
    const encrypterSub = makeEncrypter()
    const sut = new DbAddAccount(encrypterSub)

    return {
        sut, 
        encrypterSub
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

    // test('Shold throw Encrypter throws', async () => {
    //     const { sut, encrypterSub } = makeSut()
    //     jest.spyOn(encrypterSub, 'encrypt').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))

    //     const accountData = { 
    //         name: 'valid_name',
    //         email: 'valid_email',
    //         password: 'valid_password',
    //     }
    //     const promise = await sut.add(accountData)
    //     await expect(promise).rejects.toThrow()
    // })
})