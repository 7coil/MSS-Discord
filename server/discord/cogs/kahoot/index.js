const request = require('request');
const config = require('config');

// Set expiry timestamp for Kahoot
let expiry = 0;
let token = '';

const authenticate = (callback) => {
	const time = Math.floor(Date.now() / 1000);

	// If the token has expired, get a new one, otherwise send the old one.
	if (time > expiry) {
		const data = {
			url: 'https://create.kahoot.it/rest/authenticate',
			json: true,
			headers: {
				'User-Agent': config.get('useragent'),
			},
			body: {
				grant_type: 'password',
				username: config.get('api').kahoot.username,
				password: config.get('api').kahoot.password
			}
		};

		request.post(data, (err, res, body) => {
			console.log('Authenticated with Kahoot!');
			expiry = body.expires;
			token = body.access_token;
			callback(token);
		});
	} else {
		callback(token);
	}
};

module.exports.info = {
	name: 'Kahoot Search',
	category: 'Fun',
	aliases: [
		'kahoot'
	]
};

module.exports.command = (message) => {
	const search = encodeURIComponent(message.input);

	authenticate((auth) => {
		const data = {
			url: `https://create.kahoot.it/rest/kahoots/search/public?query=${search}&limit=5`,
			json: true,
			headers: {
				'User-Agent': config.get('useragent'),
				Authorization: auth
			}
		};

		request.get(data, (err, res, body) => {
			if (err) {
				message.channel.send('Request error!');
			} else if (body.error) {
				message.channel.createMessage(body.error);
			} else if (body.entities.length === 0) {
				message.channel.createMessage('No Kahoots found.');
			} else {
				message.channel.createMessage({
					embed: {
						title: body.entities[0].title,
						url: `https://create.kahoot.it/#quiz/${body.entities[0].uuid}`,
						description: body.entities[0].description,
						timestamp: new Date(body.entities[0].created),
						author: {
							name: body.entities[0].creator_username
						},
						image: {
							url: body.entities[0].cover
						},
						footer: {
							text: `${body.totalHits} Kahoots found`
						}
					}
				});
			}
		});
	});
};
