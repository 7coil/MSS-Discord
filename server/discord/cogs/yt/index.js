const searchYT = require('youtube-node');
const config = require('config');
const utils = require('./../../utils.js');

const searchYTClient = new searchYT(); // eslint-disable-line new-cap
searchYTClient.setKey(config.get('api').youtube);

module.exports.info = {
	name: 'YouTube',
	description: 'Play a YouTube video/livestream using ytdl-core. Livestreams will start from the beginning, or 4 hours ago.',
	category: 'Music',
	aliases: [
		'yt',
		'youtube'
	],
	use: [
		{
			name: '<query>',
			value: 'Search and play the audio of the YouTube video/livestream.'
		}
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
			} else if (!result || !result.items || !video) {
				message.channel.createMessage('No results found');
			} else {
				utils.music.add(message, {
					type: 'get',
					from: 'YouTube',
					media: video.id.videoId,
					title: video.snippet.title,
					thumb: video.snippet.thumbnails.default.url,
					desc: video.snippet.description
				});
			}
		});
	}
};
