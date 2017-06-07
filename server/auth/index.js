/*jshint node:true */
'use strict';

var config = require('config');
var passport = require('passport');
var DiscordStrategy = require('passport-discord').Strategy;
var r = require('../db');

passport.serializeUser(function (user, done) {
	return done(null, user.id);
});

passport.deserializeUser(function (id, done) {
	r.table('users')
		.get(id)
		.run(r.conn)
		.then(function (user) {
			done(null, user);
		});
});

var loginCallbackHandler = function (objectMapper, type) {
	return function (accessToken, refreshToken, profile, done) {
		if (accessToken !== null) {
		r.table('users')
			.getAll(profile.username || profile.name || profile.id, { index: 'login' })
			.filter({ type: type })
			.run(r.conn)
			.then(function (cursor) {
				return cursor.toArray()
					.then(function (users) {
						if (users.length > 0) {
							return done(null, users[0]);
						}
						return r.table('users')
							.insert(objectMapper(profile))
							.run(r.conn)
							.then(function (response) {
								return r.table('users')
									.get(response.generated_keys[0])
									.run(r.conn);
							})
							.then(function (newUser) {
								done(null, newUser);
							});
					});
			})
			.catch(function (err) {
				console.log('Error Getting User', err);
			});
		}
	};
};

// DiscordApp
passport.use(new DiscordStrategy({
		clientID: config.get('api').discord.clientID,
		clientSecret: config.get('api').discord.clientSecret,
		callbackURL: config.get('callback') + '/discord',
		scope: config.get('api').discord.scope
    },
	loginCallbackHandler(function (profile) {
		return {
			'login': profile.id,
			'name': `${profile.username}#${profile.discriminator}` || null,
			'avatarUrl': `https://images.discordapp.net/avatars/${profile.id}/${profile.avatar}.png?size=512`,
			'type': 'discord'
		};
	}, 'discord')
));

passport.checkIfLoggedIn = function (req, res, next) {
	if (req.user) {
		return next();
	}
	res.status(401);
	return res.render('error.html', { user: req.user, status: 401, message: "You have not logged in yet" });
};

module.exports = passport;
