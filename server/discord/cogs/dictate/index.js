const config = require('config');
const utils = require('./../../utils.js');

module.exports.info = {
	name: 'Fonix DECtalk Text to Speech',
	category: 'Music',
	aliases: [
		'dictate',
		'tts',
		'dec'
	]
};

module.exports.command = (message) => {
	if (message.input) {
		const data = {
			url: 'https://talk.moustacheminer.com/api/gen',
			method: 'POST',
			json: true,
			headers: {
				'User-Agent': config.get('useragent')
			},
			body: {
				dectalk: message.input
			}
		};

		utils.music.add(message, {
			type: 'post',
			from: 'DECtalk',
			media: data,
			title: 'DECtalk Text To Speech',
			thumb: 'https://upload.wikimedia.org/wikipedia/commons/2/2b/DECtalk_DCT01_and_Tink.jpg',
			desc: message.input
		});
	}
};
