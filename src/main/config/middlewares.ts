import { Express } from 'express'
import { contentType, bodyParser, cors } from '../middlewares'

export default (app: Express): void => {
    app.use(bodyParser)
    app.use(cors)
    app.use(contentType)
}