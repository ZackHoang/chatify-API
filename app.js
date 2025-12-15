require('dotenv').config();
const { PrismaSessionStore } = require('@quixo3/prisma-session-store');
const cors = require('cors');
const express = require('express');
const session = require('express-session');
const prisma = require('./prisma/prisma');
const passport = require('passport');
const signInRouter = require('./routers/signInRouter');
const logInRouter = require('./routers/logInRouter');

const REMOVE_EXPIRED_SESSION_INTERVAL_MS = 2 * 60 * 1000;
const app = express();

app.use(
    cors({
        origin: process.env.ORIGIN,
        credentials: true,
    })
);
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
            checkPeriod:
                process.env.NODE_ENV === 'test'
                    ? 0
                    : REMOVE_EXPIRED_SESSION_INTERVAL_MS, //ms
            dbRecordIdIsSessionId: true,
            dbRecordIdFunction: undefined,
        }),
    })
);
app.use(passport.session());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/sign-in', signInRouter);
app.use('/log-in', logInRouter);

module.exports = app;
