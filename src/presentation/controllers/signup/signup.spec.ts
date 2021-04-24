
import { MissingParamError, ServerError } from "../../errors"
import { badRequest, ok, serverError } from "../../helpers/http-helper"
import { HttpRequest } from "../../protocols"
import { SignUpController } from "./signup"
import { AccountModel, AddAccount, AddAccountModel, Validation } from "./signup-protocols"

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

interface SutTypes {
    sut: SignUpController,
    addAccountStub: AddAccount,
    validationStub: Validation
}

const makeValidation = (): Validation => {
    class ValidationStub implements Validation {
        validate(input: any): Error {
            return null;
        }
    }
    return new ValidationStub()
}

const makeSut = (): SutTypes => {
    const addAccountStub = makeAddAccount()
    const validationStub = makeValidation()
    const sut = new SignUpController(addAccountStub, validationStub)


    return {
        sut,
        addAccountStub,
        validationStub
    }
}

describe('SignUp Controller', () => {


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

    test('Should call Validation with correct value', async () => {
        const { sut, validationStub } = makeSut() // system under test
        const validateSpy = jest.spyOn(validationStub, 'validate')
        const httpRequest = makeFakeRequest()
        await sut.handle(httpRequest)

        expect(validateSpy).toHaveBeenCalledWith(httpRequest.body)
    })

    test('Should return 400 if validation returns an error', async () => {
        const { sut, validationStub } = makeSut() // system under test
        jest.spyOn(validationStub, 'validate').mockReturnValueOnce(new MissingParamError('any_field'))
        const httpResponse = await sut.handle(makeFakeRequest())
        expect(httpResponse).toEqual(badRequest(new MissingParamError('any_field')))
    })
})