const request = require('request');
const config = require('config');

module.exports = function gist(input, callback) {
	if (typeof input !== 'string') throw new Error('Input for GitHub Gists was not a String.');

	const data = {
		url: 'https://api.github.com/gists',
		method: 'POST',
		json: true,
		headers: {
			'User-Agent': config.get('useragent'),
		},
		body: {
			description: 'Collabot Discord Bot Large-Text Output',
			public: true,
			files: {
				moustacheminer: {
					content: input,
				}
			}
		}
	};

	request.post(data, (err, res, body) => {
		if (err) {
			throw new Error('Error in posting GitHub Gist');
		}

		callback(body.files.moustacheminer.raw_url);
	});
};
