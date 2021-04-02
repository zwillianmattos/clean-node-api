import request from 'supertest'
import app from '../config/app'

describe('Content Type', () => {
    test('Shold return default content Type as json', async () => {
        app.get('/test_content_type', (req, res) => {
            res.send('')
        })

        await request(app)
            .get('/test_content_type')
            .expect('content-type', /json/)
    })

    test('Shold return xml content Type when forced', async () => {
        app.get('/test_content_type_xml', (req, res) => {
            res.type('xml')
            res.send('')
        })

        await request(app)
            .get('/test_content_type_xml')
            .expect('content-type', /xml/)
    })
})