export class SignUpController {
    handle(httpRequest: any): any {
        return {
            stausCode: 400,
            body: new Error('Missing param: name')
        }
    }
}