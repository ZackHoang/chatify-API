const request = require('supertest');
const { test } = require('@jest/globals');
const app = require('./app');

test('index route sends "Hello World!', (done) => {
    request(app)
        .get('/')
        .expect('Content-Type', /json/)
        .expect({
            message: 'Hello World!',
        })
        .expect(200, done);
});
