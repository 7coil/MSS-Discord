const config = require('config');
const request = require('request');
const utils = require('./../../utils.js');

module.exports.info = {
	name: 'Twitch.tv Livestream',
	description: 'Play a Twitch.tv livestream using youtube-dl, which is prone to cutting out.',
	category: 'Music',
	aliases: [
		'twitch',
		'ttv'
	],
	use: [
		{
			name: '<username>',
			value: 'Play the audio of the Twitch streamer.'
		}
	]
};

module.exports.command = (message) => {
	if (!message.input) {
		message.channel.createMessage('No Twitch username provided');
	} else {
		const username = encodeURI(message.input.substring(message.content.lastIndexOf('/') + 1));

		if (!username) {
			message.channel.createMessage('Invalid Twitch username');
		} else {
			const query = {
				method: 'GET',
				json: true,
				uri: `https://api.twitch.tv/kraken/streams/${username}`,
				headers: {
					'User-Agent': config.get('useragent'),
					'Client-ID': config.get('api').twitch
				}
			};

			request(query, (err, res, body) => {
				if (body.error) {
					message.channel.createMessage('An error occured with the Twitch API server.');
				} else if (!body.stream) {
					message.channel.createMessage('The streamer is currently not live.');
				} else {
					utils.music.add(message, {
						type: 'youtube-dl',
						from: 'Twitch',
						media: `https://twitch.tv/${username}`,
						title: body.stream.channel.display_name,
						thumb: body.stream.preview.large,
						desc: body.stream.channel.status
					});
				}
			});
		}
	}
};
