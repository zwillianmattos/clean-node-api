import request from 'supertest'
import app from '../config/app'

describe('Signup Routes', () => {
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