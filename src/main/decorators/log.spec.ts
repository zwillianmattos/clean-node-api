import { Controller, HttpRequest, HttpResponse } from "../../presentation/protocols"
import { LogControllerDecorator } from "./logs"

interface SutTypes {
    sut: LogControllerDecorator,
    controllerStub: Controller   
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

const makeSut = (): SutTypes => {
    const controllerStub = makeController()
    const sut = new LogControllerDecorator(controllerStub)

    return {
        sut,
        controllerStub
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
        expect(handleSpy).toHaveBeenCalledWith()
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
})