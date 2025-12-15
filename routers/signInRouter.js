const { Router } = require('express');
const { signIn } = require('../controllers/signInController');
const signInRouter = Router();

signInRouter.post('/', signIn);

module.exports = signInRouter;
