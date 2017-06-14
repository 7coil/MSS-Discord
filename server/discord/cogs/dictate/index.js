const config = require('config');

module.exports = function dictate(message) {
	const data = {
		url: 'https://talk.moustacheminer.com/api/gen',
		method: 'POST',
		json: true,
		headers: {
			'User-Agent': config.get('useragent')
		},
		body: {
			dectalk: `${message.content}[_<7000>]`
		}
	};

	return message.client.mss.functions.music.add(message, 'post', data, 'MSS DecTalk', 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2b/DECtalk_DCT01_and_Tink.jpg/300px-DECtalk_DCT01_and_Tink.jpg');
};
