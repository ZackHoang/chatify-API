require('dotenv').config();
const { PrismaSessionStore } = require('@quixo3/prisma-session-store');
const cors = require('cors');
const express = require('express');
const session = require('express-session');
const prisma = require('./prisma/prisma');

const app = express();

app.use(
    cors({
        origin: process.env.ORIGIN,
        credentials: true,
    })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
    session({
        secret: process.env.SECRET,
        resave: false,
        saveUninitialized: false,
        cookie: {
            maxAge: 1000 * 3600,
            sameSite: false,
            httpOnly: false,
        },
        name: 'chatify',
        store: new PrismaSessionStore(prisma, {
            checkPeriod: 2 * 60 * 1000, //ms
            dbRecordIdIsSessionId: true,
            dbRecordIdFunction: undefined,
        }),
    })
);

app.use('/', (req, res) => {
    res.json({
        message: 'Hello World!',
    });
});

module.exports = app;
