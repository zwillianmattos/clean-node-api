
import { InvalidParamError, MissingParamError, ServerError } from "../../errors"
import { badRequest, ok, serverError } from "../../helpers/http-helper"
import { HttpRequest } from "../../protocols"
import { SignUpController } from "./signup"
import { EmailValidator, AccountModel, AddAccount, AddAccountModel } from "./signup-protocols"

const makeFakeRequest = (): HttpRequest => ({
    body: {
        name: 'any_name',
        email: 'any_email@mail.com',
        password: 'any_password',
        passwordConfirmation: 'any_password'
    }
})

const makeFakeAccount = (): AccountModel => ({
    id: 'valid_id',
    name: 'valid_name',
    email: 'valid_email@mail.com',
    password: 'valid_password'
})

const makeAddAccount = (): AddAccount => {
    class AddAccountStub implements AddAccount {
        async add(account: AddAccountModel): Promise<AccountModel> {
            return new Promise(res => res(makeFakeAccount()));
        }
    }
    return new AddAccountStub()
}

const makeEmailValidator = (): EmailValidator => {
    class EmailValidatorStub implements EmailValidator {
        isValid(email: string): boolean {
            return true
        }
    }
    return new EmailValidatorStub()
}



interface SutTypes {
    sut: SignUpController,
    emailValidatorStub: EmailValidator,
    addAccountStub: AddAccount
}

const makeSut = (): SutTypes => {
    const emailValidatorStub = makeEmailValidator()
    const addAccountStub = makeAddAccount()
    const sut = new SignUpController(emailValidatorStub, addAccountStub)


    return {
        sut,
        emailValidatorStub,
        addAccountStub
    }
}

describe('SignUp Controller', () => {
    test('Should return 400 if no name is provided', async () => {
        const { sut } = makeSut() // system under test
        const httpRequest = {
            body: {
                email: 'any_email@mail.com',
                password: 'any_password',
                passwordConfirmation: 'any_password'
            }
        }
        const httpResponse = await sut.handle(httpRequest)
        expect(httpResponse).toEqual(badRequest(new MissingParamError('name')))
    })

    test('Should return 400 if no email is provided', async () => {
        const { sut } = makeSut() // system under test
        const httpRequest = {
            body: {
                name: 'any_name',
                password: 'any_password',
                passwordConfirmation: 'any_password'
            }
        }
        const httpResponse = await sut.handle(httpRequest)
        expect(httpResponse).toEqual(badRequest(new MissingParamError('email')))
    })


    test('Should return 400 if no password is provided', async () => {
        const { sut } = makeSut() // system under test
        const httpRequest = {
            body: {
                name: 'any_name',
                email: 'any_email@mail.com',
                passwordConfirmation: 'any_password'
            }
        }
        const httpResponse = await sut.handle(httpRequest)
        expect(httpResponse).toEqual(badRequest(new MissingParamError('password')))
    })

    test('Should return 400 if no passwordConfirmation  is provided', async () => {
        const { sut } = makeSut() // system under test
        const httpRequest = {
            body: {
                name: 'any_name',
                email: 'any_email@mail.com',
                password: 'any_password',
            }
        }
        const httpResponse = await sut.handle(httpRequest)
        expect(httpResponse).toEqual(badRequest(new MissingParamError('passwordConfirmation')))
    })

    test('Should return 400 if no password confirmation fails', async () => {
        const { sut } = makeSut() // system under test
        const httpRequest = {
            body: {
                name: 'any_name',
                email: 'any_email@mail.com',
                password: 'any_password',
                passwordConfirmation: 'invalid_password'
            }
        }
        const httpResponse = await sut.handle(httpRequest)
        expect(httpResponse).toEqual(badRequest(new InvalidParamError('passwordConfirmation')))
    })

    test('Should return 400 if an invalid email is provided', async () => {
        const { sut, emailValidatorStub } = makeSut() // system under test
        jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)
        const httpResponse = await sut.handle(makeFakeRequest())
        expect(httpResponse).toEqual(badRequest(new InvalidParamError('email')))
    })

    test('Should call EmailValidator with corret email', () => {
        const { sut, emailValidatorStub } = makeSut() // system under test
        const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid')
        sut.handle(makeFakeRequest())
        expect(isValidSpy).toHaveBeenCalledWith('any_email@mail.com')
    })

    test('Should call AddAccount with corret values', () => {
        const { sut, addAccountStub } = makeSut() // system under test
        const addSpy = jest.spyOn(addAccountStub, 'add')
        sut.handle(makeFakeRequest())
        expect(addSpy).toHaveBeenCalledWith({
            name: 'any_name',
            email: 'any_email@mail.com',
            password: 'any_password'
        })
    })

    test('Should return 500 if EmailValidator throws', async () => {
        const { sut, emailValidatorStub } = makeSut() // system under test
        jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => {
            throw new Error()
        })
        const httpResponse = await sut.handle(makeFakeRequest())
        expect(httpResponse).toEqual(serverError(new ServerError(null)))
    })

    test('Should return 500 if AddAccount throws', async () => {
        const { sut, addAccountStub } = makeSut() // system under test
        jest.spyOn(addAccountStub, 'add').mockImplementationOnce(() => {
            throw new Error()
        })
        const httpResponse = await sut.handle(makeFakeRequest())
        expect(httpResponse).toEqual(serverError(new ServerError(null)))
    })


    test('Should return 200 if valid data is provided', async () => {
        const { sut } = makeSut() // system under test
        const httpResponse = await sut.handle(makeFakeRequest())
        expect(httpResponse).toEqual(ok(makeFakeAccount()))
    })
})