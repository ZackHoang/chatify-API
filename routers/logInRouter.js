const { Router } = require('express');
const logIn = require('../auth/passport.js');
const logInRouter = Router();

logInRouter.post('/', logIn);

module.exports = logInRouter;
