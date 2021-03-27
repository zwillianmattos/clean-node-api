export class SignUpController {
    handle(httpRequest: any): any {
        if(!httpRequest.body.name) {
            return {
                stausCode: 400,
                body: new Error('Missing param: name')
            }
        }
        if(!httpRequest.body.email) {
            return {
                stausCode: 400,
                body: new Error('Missing param: email')
            }
        }
    }
}