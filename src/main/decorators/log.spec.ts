import { resolve } from "node:path"
import { LogErrorRepository } from "../../data/protocols/log-error-repository"
import { serverError } from "../../presentation/helpers/http-helper"
import { Controller, HttpRequest, HttpResponse } from "../../presentation/protocols"
import { LogControllerDecorator } from "./logs"


const makeLogErrorRepository =(): LogErrorRepository => {
    class LogErrorRepositoryStub implements LogErrorRepository {
        async log(stack: string): Promise<void> {
            return new Promise(resolve => resolve())
        }
    }
    
    return new LogErrorRepositoryStub()
}

const makeController =(): Controller => {
    class ControllerStub implements Controller {
        async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
            const httpResponse: HttpResponse = {
                statusCode: 200,
                body: {
                    name: 'Willian'
                }
            }
            return new Promise(resolve => resolve(httpResponse))
        }
    }

    return new ControllerStub()
}



interface SutTypes {
    sut: LogControllerDecorator,
    controllerStub: Controller,
    logErrorRepositoryStub: LogErrorRepository  
}

const makeSut = (): SutTypes => {
    const controllerStub = makeController()
    const logErrorRepositoryStub = makeLogErrorRepository()
    const sut = new LogControllerDecorator(controllerStub, logErrorRepositoryStub)

    return {
        sut,
        controllerStub,
        logErrorRepositoryStub
    }
}

describe('LogController Decorator', () => {
    test('Shold call controller handle', async () => {
        const { sut, controllerStub } = makeSut()        
        const handleSpy = jest.spyOn(controllerStub, 'handle')
        const httpRequest = {
            body: {
                name: 'any_name',
                email: 'any@mail.com',
                password: 'any_password',
                passwordConfirmation: 'any_password'
            }
        }

        await sut.handle(httpRequest)
        expect(handleSpy).toHaveBeenCalledWith(httpRequest)
    })

    test('Shold return the same result of the controller', async () => {
        const { sut } = makeSut()        
        const httpRequest = {
            body: {
                name: 'Willian',
                email: 'willian_matt@hotmail.com',
                password: '123',
                passwordConfirmation: '123'
            }
        }

        const httpResponse = await sut.handle(httpRequest)
        expect(httpResponse).toEqual({
            statusCode: 200,
            body: {
                name: 'Willian'
            }
        })
    })

    test('Shold call LogErrorRepository with correct error if controller returns a  server error', async () => {
        const { sut, controllerStub, logErrorRepositoryStub } = makeSut()        
        const fakeError = new Error()
        fakeError.stack = 'any_stack'
        const error = serverError(fakeError)
        const logSpy = jest.spyOn(logErrorRepositoryStub, 'log')
        jest.spyOn(controllerStub, 'handle').mockReturnValueOnce(new Promise(resolve => resolve(error)))
        
        const httpRequest = {
            body: {
                name: 'Willian',
                email: 'willian_matt@hotmail.com',
                password: '123',
                passwordConfirmation: '123'
            }
        }

        await sut.handle(httpRequest)
        expect(logSpy).toHaveBeenCalledWith('any_stack')
    })
})