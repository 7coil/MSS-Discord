const searchYT = require('youtube-node');
const config = require('config');
const utils = require('./../../utils.js');

const searchYTClient = new searchYT(); // eslint-disable-line new-cap
searchYTClient.setKey(config.get('api').youtube);

module.exports.info = {
	name: 'YouTube',
	category: 'music',
	aliases: [
		'yt',
		'youtube'
	]
};

module.exports.command = (message) => {
	if (!message.input) {
		message.channel.createMessage('Please enter query.');
	} else {
		searchYTClient.search(message.input, 10, (error, result) => {
			const video = result.items.find(youtube => youtube.id.videoId);

			if (error) {
				console.log(error);
				message.channel.createMessage(error);
			} else if (!video) {
				message.channel.createMessage('No results found');
			} else {
				utils.music.add(message, {
					type: 'ytdl',
					from: 'YouTube',
					media: `https://youtube.com/watch?v=${video.id.videoId}`,
					title: video.snippet.title,
					thumb: video.snippet.thumbnails.default.url,
					desc: video.snippet.description
				});
			}
		});
	}
};
