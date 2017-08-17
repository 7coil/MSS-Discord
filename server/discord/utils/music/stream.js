const ytdl = require('ytdl-core');
const request = require('request');
const config = require('config');
const twitch = require('twitch-get-stream')(config.get('api').twitch);

module.exports = media =>
	new Promise((resolve, reject) => {
		if (media.from === 'YouTube') {
			ytdl.getInfo(media.media, (info) => {
				const stream = info.formats
					.filter(format => format.audioBitrate && !format.bitrate)
					.sort((format1, format2) => format2.audioBitrate - format1.audioBitrate[0]);

				if (stream) {
					resolve(stream);
				} else {
					reject('Could not find Stream URL');
				}
			});
		} else if (media.from === 'Twitch') {
			const query = {
				method: 'GET',
				json: true,
				uri: `https://api.twitch.tv/kraken/streams/${media.media}`,
				headers: {
					'User-Agent': config.get('useragent'),
					'Client-ID': config.get('api').twitch
				}
			};

			request(query, (err, res, body) => {
				if (err) {
					reject('An error occured with the request.');
				} else if (body.error) {
					reject('An error occured with the Twitch API server.');
				} else if (!body.stream) {
					reject('The stream could not be played because the stream is offline.');
				} else {
					twitch.get(media.username).then((streams) => {
						const stream = streams.find(format => format.quality === 'Audio Only').url;

						if (stream) {
							resolve(stream);
						} else {
							reject('Could not find an adequate stream URL for this streamer.');
						}
					});
				}
			});
		}
	});
