const config = require('config');
const request = require('request');
const music = require('./../music');
const YT = require('youtube-node');

const searchYTClient = new YT();
searchYTClient.setKey(config.get('api').youtube);

module.exports = [{
	aliases: [
		'twitch',
		'ttv'
	],
	name: 'twitch',
	uses: 1,
	admin: 0,
	command: (message) => {
		if (!message.mss.input) {
			message.channel.createMessage(message.__('twitch_none'));
		} else {
			const username = encodeURI(message.mss.input.substring(message.mss.input.lastIndexOf('/') + 1));

			if (!username) {
				message.channel.createMessage(message.__('twitch_invalid'));
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
						message.channel.createMessage(message.__('err_generic'));
					} else if (!body.stream) {
						message.channel.createMessage(message.__('twitch_notlive'));
					} else {
						music.add(message, {
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
	}
}, {
	aliases: [
		'youtube',
		'yt'
	],
	name: 'youtube',
	uses: 1,
	admin: 0,
	command: (message) => {
		if (!message.mss.input) {
			message.channel.createMessage(message.__('youtube_none'));
		} else {
			searchYTClient.search(message.mss.input, 10, (error, result) => {
				const video = result.items.find(youtube => youtube.id.videoId);

				if (error) {
					console.log(error);
					message.channel.createMessage(error);
				} else if (!result || !result.items || !video) {
					message.channel.createMessage(message.__('youtube_404'));
				} else {
					music.add(message, {
						type: 'youtube-dl',
						from: 'YouTube',
						media: video.id.videoId,
						title: video.snippet.title,
						thumb: video.snippet.thumbnails.default.url,
						desc: video.snippet.description
					});
				}
			});
		}
	}
}, {
	aliases: [
		'tts',
		'dictate',
		'dectalk'
	],
	name: 'tts',
	uses: 1,
	admin: 0,
	command: (message) => {
		if (message.mss.input) {
			const data = {
				url: 'https://talk.moustacheminer.com/api/gen',
				method: 'POST',
				json: true,
				headers: {
					'User-Agent': config.get('useragent')
				},
				body: {
					dectalk: message.mss.input
				}
			};

			music.add(message, {
				type: 'post',
				from: 'DECtalk',
				media: data,
				title: 'DECtalk Text To Speech',
				thumb: 'https://upload.wikimedia.org/wikipedia/commons/2/2b/DECtalk_DCT01_and_Tink.jpg',
				desc: message.input
			});
		}
	}
}, {
	aliases: [
		'skip'
	],
	name: 'skip',
	uses: 1,
	admin: 1,
	command: (message) => {
		music.skip(message);
	}
}, {
	aliases: [
		'stop'
	],
	name: 'stop',
	uses: 1,
	admin: 1,
	command: (message) => {
		music.stop(message);
	}
}, {
	aliases: [
		'repeat'
	],
	name: 'repeat',
	uses: 1,
	admin: 1,
	command: (message) => {
		music.repeat(message);
	}
}, {
	aliases: [
		'list'
	],
	name: 'list',
	uses: 1,
	admin: 0,
	command: (message) => {
		music.list(message, (playlist, repeat) => {
			if (playlist.length === 0) {
				message.channel.createMessage(message.__('list_empty'));
			} else {
				let reply = '```\n';
				reply += repeat ? message.__('list_repeat_on') : message.__('list_repeat_off');
				reply += '\n';
				playlist.forEach((element, index) => {
					reply += `[${index || message.__('list_current')}] ${element.title}\n`;
				});
				reply += '```';

				if (reply && reply.length > 1900) {
					message.channel.createMessage(message.__('list_length'));
				} else {
					message.channel.createMessage(reply);
				}
			}
		});
	}
}];
