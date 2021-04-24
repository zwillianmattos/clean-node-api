import { InvalidParamError, MissingParamError } from "../../errors";
import { Validation } from "./validation";

export class CompareFieldsValidation implements Validation {
    private readonly fieldName: string
    private readonly fieldCompareName: string
    constructor(fieldName: string, fieldCompareName: string) {
        this.fieldName = fieldName
        this.fieldCompareName = fieldCompareName
    }

    validate(input: any): Error {
        if (input[this.fieldName] !== input[this.fieldCompareName] ) {
            console.log('pooo')
            return new InvalidParamError(this.fieldCompareName)
        }
    }

}