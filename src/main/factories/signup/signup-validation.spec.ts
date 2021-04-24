
import { Validation } from "../../../presentation/controllers/signup/signup-protocols";
import { CompareFieldsValidation, EmailValidation, RequiredFieldValidation, ValidationComposite } from "../../../presentation/helpers/validators";
import { EmailValidator } from "../../../presentation/protocols/email-validator";
import { makeSignUpValidation } from "./signup-validation"


jest.mock("../../../presentation/helpers/validators/validation-composite")

const makeEmailValidator = (): EmailValidator => {
    class EmailValidatorStub implements EmailValidator {
        isValid(email: string): boolean {
            return true
        }
    }
    return new EmailValidatorStub()
}

describe('SignUpValidation Factory', () => {
    test('Should call ValidationComposite with all validations', async () => {
        makeSignUpValidation()
        const validations: Validation[] = []
        for (const field of ['name', 'email', 'password', 'passwordConfirmation']) {
            validations.push(new RequiredFieldValidation(field))
        }
        validations.push(new CompareFieldsValidation('password', 'passwordConfirmation'))
        validations.push(new EmailValidation('email', makeEmailValidator()))
        expect(ValidationComposite).toHaveBeenCalledWith(validations)
    })
})