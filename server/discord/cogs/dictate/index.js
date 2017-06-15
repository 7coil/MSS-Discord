const config = require('config');
const utils = require('./../../utils.js');

module.exports.alias = [
	'dictate',
	'dectalk',
	'dec',
	'fonix'
];

module.exports.command = (message, client) => {
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

	if (message.content) utils.music.add(message, client, 'post', data, 'MSS DecTalk', 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2b/DECtalk_DCT01_and_Tink.jpg/300px-DECtalk_DCT01_and_Tink.jpg');
};
