const request = require('supertest')
const app = require('../../app.js')

describe('integration/app', () => {
    beforeAll(() => {
        return require('../../models').sequelize.sync({ force: true }) // Clear database
    })

    // Test home page
    describe('Testing root path', () => {
        test('It should respond to the GET method with code 302', () => {
            return request(app).get('/')
                .expect(200)
        })
    })

    // Test sending a new web view
    describe('POST /track/log/', () => {
        test('It should respond to the POST method with code 200', () => {
            const json = {
                hitId: '123abc',
                pathName: '/',
                query: '',
                viewerId: '456def',
                referrer: ''
            }
            return request(app).post('/track/log/')
                .send(json)
                .expect(200)
        })
    })

    // Test adding 'time on page' to the previous web view
    describe('POST /track/time/', () => {
        test('It should respond to the POST method with code 200', () => {
            const json = {
                hitId: '123abc'
            }
            return request(app).post('/track/time/')
                .send(json)
                .expect(200)
        })
    })
})