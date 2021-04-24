import jwt, { sign } from 'jsonwebtoken'

import { JwtAdapter } from './jwt-adapter'


jest.mock('jsonwebtoken', () => ({
    async sign(): Promise<string> {
        return new Promise(resolve => resolve('any_token'))
    }
}))

const makeSut = (): JwtAdapter => {
    return new JwtAdapter('secret')
}


describe('Jwt Adapter', () => {
    test('Shold call sign with correct values', async () => {
        const sut = makeSut()
        const signSpy = jest.spyOn(jwt, 'sign')
        await sut.encrypt('any_id')
        expect(signSpy).toHaveBeenCalledWith({
            id: 'any_id',
        }, 'secret')
    })

    test('Shold return a token on sign success', async () => {
        const sut = makeSut()
        const accessToken = await sut.encrypt('any_id')
        expect(accessToken).toBe('any_token')
    })

    test('Shold throw if sign throws', async () => {
        const sut = makeSut()
        jest.spyOn(jwt, 'sign').mockImplementationOnce(() => {
            throw new Error()
        })
        const promise = sut.encrypt('any_id')
        expect(promise).rejects.toThrow()
    })
})