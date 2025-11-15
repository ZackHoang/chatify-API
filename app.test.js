const request = require('supertest');
const { test, beforeAll, afterAll } = require('@jest/globals');
const app = require('./app');
const prisma = require('./prisma/prisma');

beforeAll((done) => {
    done();
});

afterAll(async () => {
    await prisma.$disconnect();
});

test('index route sends "Hello World!', (done) => {
    request(app)
        .get('/')
        .expect('Content-Type', /json/)
        .expect({
            message: 'Hello World!',
        })
        .expect(200, done);
});
