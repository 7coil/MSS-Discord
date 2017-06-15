const config = require('config');
const passport = require('passport');
const DiscordStrategy = require('passport-discord').Strategy;
const r = require('../db');

passport.serializeUser((user, done) => done(null, user.id));

passport.deserializeUser((id, done) => {
	r.table('users')
		.get(id)
		.run(r.conn)
		.then((user) => {
			done(null, user);
		});
});

const loginCallbackHandler = (objectMapper, type) =>
	(accessToken, refreshToken, profile, done) => {
		if (accessToken !== null) {
			r.table('users')
				.getAll(profile.username || profile.name || profile.id, { index: 'login' })
				.filter({ type })
				.run(r.conn)
				.then(cursor =>
					cursor.toArray()
						.then((users) => {
							if (users.length > 0) {
								return done(null, users[0]);
							}
							return r.table('users')
								.insert(objectMapper(profile))
								.run(r.conn)
								.then(response =>
									r.table('users')
										.get(response.generated_keys[0])
										.run(r.conn)
								)
								.then((newUser) => {
									done(null, newUser);
								});
						})
				)
				.catch((err) => {
					throw err;
				});
		}
	};

// DiscordApp
passport.use(new DiscordStrategy(
	{
		clientID: config.get('api').discord.clientID,
		clientSecret: config.get('api').discord.clientSecret,
		callbackURL: `${config.get('callback')}/discord`,
		scope: config.get('api').discord.scope,
	},
	loginCallbackHandler(profile => (
		{
			login: profile.id,
			name: `${profile.username}#${profile.discriminator}` || null,
			avatarUrl: `https://images.discordapp.net/avatars/${profile.id}/${profile.avatar}.png?size=512`,
			type: 'discord',
		}
	), 'discord')
));

passport.checkIfLoggedIn = (req, res, next) => {
	if (req.user) {
		return next();
	}
	res.status(401);
	return res.render('index.html', { user: req.user, error: 401, message: 'You have not logged in yet' });
};

module.exports = passport;
