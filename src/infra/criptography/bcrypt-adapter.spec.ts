import bcrypt from 'bcrypt'
import { BcryptAdapter } from './bcrypt-adapter'

jest.mock('bcrypt', () => ({
    async hash(): Promise<string> {
        return new Promise(resolve => resolve('hash'))
    },
    async compare(): Promise<boolean> {
        return new Promise(resolve => resolve(true))
    }
}))


const salt = 12
const makeSut = (): BcryptAdapter => {
    return new BcryptAdapter(salt)
}


describe('Bcrypt Adapter', () => {
    test('Shold call hash with correct password ', async () => {
        const sut = makeSut()
        const hashSpy = jest.spyOn(bcrypt, 'hash')
        await sut.hash('any_value')
        expect(hashSpy).toHaveBeenCalledWith('any_value', salt)
    })

    test('Shold return a valid hash on hash success', async () => {
        const sut = makeSut()
        const hash = await sut.hash('any_value')
        expect(hash).toBe('hash')
    })

    test('Shold throw if bcrypt throws', async () => {
        const sut = makeSut()
        jest.spyOn(bcrypt, 'hash').mockReturnValueOnce(
            new Promise((resolve, reject) => reject(new Error()))
        )
        const promise = sut.hash('any_value')
        await expect(promise).rejects.toThrow()
    })

    test('Shold call compare with correct values ', async () => {
        const sut = makeSut()
        const compareSpy = jest.spyOn(bcrypt, 'compare')
        await sut.compare('any_value', 'any_hash')
        expect(compareSpy).toHaveBeenCalledWith('any_value', 'any_hash')
    })

    test('Shold return true when compare succeds', async () => {
        const sut = makeSut()
        const isValid = await sut.compare('any_value', 'any_hash')
        expect(isValid).toBe(true)
    })
})