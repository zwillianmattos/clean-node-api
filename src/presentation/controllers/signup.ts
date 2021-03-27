import { HttpRequest, HttpResponse } from "../protocols/http"

export class SignUpController {
    handle(httpRequest: HttpRequest): HttpResponse {
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