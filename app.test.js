const request = require('supertest');
const { test, describe, afterAll, beforeAll } = require('@jest/globals');
const app = require('./app');
const { successResponse } = require('./responses/successResponse');
const { failResponse } = require('./responses/failResponse');
const prisma = require('./prisma/prisma');

const EMPTY = '';
const EMAIL = 'johndoe@mail.com';
// const INVALID_EMAIL = 'john';
const USERNAME = 'JohnDoe';
const PASSWORD = 'abc1234';
const INCORRECT_PASSWORD_CONFIRM = '1234';

beforeAll(async () => {
    await prisma.$connect();
});

afterAll(async () => {
    await prisma.user.delete({
        where: {
            email: 'johndoe@mail.com',
        },
    });
    prisma.$disconnect();
});

describe('POST /sign-up', () => {
    test('fail response when all possible errors when all fields are empty', (done) => {
        request(app)
            .post('/sign-in')
            .send({
                email: EMPTY,
                username: EMPTY,
                password: EMPTY,
                confirm_password: EMPTY,
            })
            .expect(
                400,
                failResponse({
                    errors: [
                        'E-mail cannot be empty',
                        'E-mail is invalid',
                        'Username cannot be empty',
                        'Password cannot be empty',
                    ],
                }),
                done
            );
    });
    test('fail response when passwords do not match', (done) => {
        request(app)
            .post('/sign-in')
            .send({
                email: EMAIL,
                username: USERNAME,
                password: PASSWORD,
                confirm_password: INCORRECT_PASSWORD_CONFIRM,
            })
            .expect(
                400,
                failResponse({
                    errors: ['Passwords do not match'],
                }),
                done
            );
    });
    test('success response signing in', (done) => {
        request(app)
            .post('/sign-in')
            .send({
                email: EMAIL,
                username: USERNAME,
                password: PASSWORD,
                confirm_password: PASSWORD,
            })
            .expect(200, successResponse(null), done);
    });
    test('fail response when a user has already existed', (done) => {
        request(app)
            .post('/sign-in')
            .send({
                email: EMAIL,
                username: USERNAME,
                password: PASSWORD,
                confirm_password: PASSWORD,
            })
            .expect(
                409,
                failResponse({
                    message: 'E-mail has already been used',
                }),
                done
            );
    });
});

describe('POST /log-in', () => {
    test('log in successfully', (done) => {
        request(app)
            .post('/log-in')
            .send({
                email: EMAIL,
                password: PASSWORD,
            })
            .expect(200, successResponse(null), done);
    });
});
