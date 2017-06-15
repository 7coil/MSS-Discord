const searchYT = require('youtube-node');
const config = require('config');
const utils = require('./../../utils.js');

const searchYTClient = new searchYT(); // eslint-disable-line new-cap
searchYTClient.setKey(config.get('api').youtube);

module.exports.alias = [
	'yt',
	'youtube'
];

module.exports.command = function yt(message, client) {
	if (!message.input) return message.channel.createMessage('Please enter query.');
	searchYTClient.search(message.input, 10, (error, result) => {
		const video = result.items.find(youtube => youtube.id.videoId);

		if (error) {
			console.log(error);
			message.channel.createMessage(error);
			return false;
		} else if (!video) {
			message.channel.createMessage('No results found');
			return false;
		}

		return utils.music.add(message, client, 'youtube', `https://youtube.com/watch?v=${video.id.videoId}`, video.snippet.title, video.snippet.thumbnails.default.url);
	});
	return false;
};
