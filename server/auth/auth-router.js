const express = require('express');
const authControllers = require('./auth-controller');
const auth = require('./index');

const authRouter = express.Router();

// DiscordApp
authRouter.use('/login/callback/discord', auth.authenticate('discord'), (req, res) => {
	res.redirect('/');
});
authRouter.get('/login/discord', auth.authenticate('discord'));

// All
authRouter.use('/user', authControllers.getUser);
authRouter.use('/logout', authControllers.logout);

module.exports = authRouter;
