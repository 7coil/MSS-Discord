const config = require('config');
const request = require('request');
const utils = require('./../../utils.js');

module.exports.alias = [
	'twitch'
];

module.exports.command = (message) => {
	const username = message.input.substring(message.content.lastIndexOf('/') + 1);
	if (!message.input) {
		message.channel.createMessage('No Twitch username provided');
	} else if (!username) {
		message.channel.createMessage('Invalid Twitch username');
	} else {
		const query = {
			method: 'GET',
			json: true,
			uri: `https://api.twitch.tv/kraken/streams/${message.input}`,
			headers: {
				'User-Agent': config.get('useragent'),
				'Client-ID': config.get('api').twitch
			}
		};

		request(query, (err, res, body) => {
			if (body.error) {
				message.channel.createMessage('Error - Blob on fire. The Twitch API server borked.');
			} else if (!body.stream) {
				message.channel.createMessage('The streamer is currently not live.');
			} else {
				utils.music.add(message, {
					type: 'ytdl',
					from: 'twitch.tv',
					media: body.stream.channel.url,
					title: body.stream.channel.display_name,
					thumb: body.stream.preview.large,
					desc: body.stream.channel.status
				});
			}
		});
	}
};
