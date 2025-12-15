const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const prisma = require('../prisma/prisma');
const bcrypt = require('bcryptjs');
const failResponse = require('../responses/failResponse');
const { successResponse } = require('../responses/successResponse');

passport.use(
    new LocalStrategy(
        { usernameField: 'email' },
        async (email, password, done) => {
            try {
                const user = await prisma.user.findUnique({
                    where: {
                        email: email,
                    },
                });
                if (user === null) {
                    return done(
                        null,
                        false,
                        'Incorrect username and/or password'
                    );
                }
                const match = await bcrypt.compare(password, user.password);
                if (!match) {
                    return done(
                        null,
                        false,
                        'Incorrect username and/or password'
                    );
                }
                return done(null, user);
            } catch (e) {
                return done(e);
            }
        }
    )
);

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await prisma.user.findUnique({
            where: {
                id: id,
            },
        });
        done(null, user);
    } catch (e) {
        done(e);
    }
});

const logIn = (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err || !user) {
            res.json(failResponse(info));
        }
        req.login(user, next);
        res.json(successResponse(null));
    })(req, res, next);
};

module.exports = logIn;
