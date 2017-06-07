/*jshint node:true */
'use strict';

var express = require('express');
var authControllers = require('./auth-controller');

var auth = require('./index');
var authRouter = express.Router();

// DiscordApp
authRouter.use('/login/callback/discord', auth.authenticate('discord'), function (req, res) {
	res.redirect('/');
});
authRouter.get('/login/discord', auth.authenticate('discord'));

// All
authRouter.use('/user', authControllers.getUser);
authRouter.use('/logout', authControllers.logout);

module.exports = authRouter;
