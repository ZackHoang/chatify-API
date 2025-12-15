const { body, validationResult, matchedData } = require('express-validator');
const prisma = require('../prisma/prisma');
const { failResponse } = require('../responses/failResponse');
const bcrypt = require('bcryptjs');
const { successResponse } = require('../responses/successResponse');

const emptyErr = 'cannot be empty';

const validateSignIn = [
    body('email')
        .trim()
        .notEmpty()
        .withMessage(`E-mail ${emptyErr}`)
        .isEmail()
        .withMessage('E-mail is invalid'),
    body('username').trim().notEmpty().withMessage(`Username ${emptyErr}`),
    body('password').trim().notEmpty().withMessage(`Password ${emptyErr}`),
    body('confirm_password')
        .trim()
        .custom((value, { req }) => {
            return value === req.body.password;
        })
        .withMessage(`Passwords do not match`),
];

const postSignIn = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json(
            failResponse({
                errors: errors.array().map((error) => {
                    return error.msg;
                }),
            })
        );
    }
    const { email, username, password } = matchedData(req);
    try {
        await prisma.user.create({
            data: {
                email: email,
                username: username,
                password: await bcrypt.hash(password, 10),
            },
        });
        res.json(successResponse(null));
    } catch {
        res.status(409).json(
            failResponse({
                message: 'E-mail has already been used',
            })
        );
    }
};

exports.signIn = [validateSignIn, postSignIn];
