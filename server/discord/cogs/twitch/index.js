const config = require('config');
const request = require('request');
const utils = require('./../../utils.js');

module.exports.alias = [
	'twitch'
];

module.exports.command = function yt(message, client) {
	const username = message.input.substring(message.content.lastIndexOf('/') + 1);
	if (!message.input) return message.channel.createMessage('No Twitch username provided');
	if (!username) return message.channel.createMessage('Invalid Twitch username');

	const query = {
		method: 'GET',
		json: true,
		uri: `https://api.twitch.tv/kraken/streams/${message.input}`,
		headers: {
			'User-Agent': config.get('useragent'),
			'Client-ID': config.get('api').twitch
		}
	};

	return request(query, (err, res, body) => {
		if (body.error) return message.channel.createMessage('Error - Blob on fire. The Twitch API server borked.');
		if (!body.stream) return message.channel.createMessage('The streamer is currently not live.');
		return utils.music.add(message, client, 'youtube', body.stream.channel.url, 'youtube-dl', 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ef/YouTube_logo_2015.svg/1200px-YouTube_logo_2015.svg.png');
	});
};

