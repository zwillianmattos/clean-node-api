import request from 'supertest'
import { MongoHelper } from '../../infra/db/mongodb/helpers/mongo-helper'
import app from '../config/app'

describe('Signup Routes', () => {

    beforeAll( async () => {
        await MongoHelper.connect(process.env.MONGO_URL)
    })

    afterAll( async () => {
        await MongoHelper.disconnect()
    })

    beforeEach( async() => {
        const accountCollection = await MongoHelper.getCollection('account')
        await accountCollection.deleteMany({})
    })
    
    test('Shold return an account on success', async () => {
        await request(app)
            .post('/api/signup')
            .send({
                name: 'Willian',
                email: 'willian_matt@hotmail.com',
                password: '123',
                passwordConfirmation: '123'
            })
            .expect(200)
    })
})