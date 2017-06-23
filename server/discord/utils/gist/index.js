const request = require('request');
const config = require('config');

module.exports = function gist(input, callback) {
	let text = null;
	if (typeof input === 'string') {
		text = input;
	} else if (typeof input === 'number') {
		text = input.toString();
	} else if (typeof input === 'boolean') {
		text = input;
	} else if (typeof input === 'object') {
		text = JSON.stringify(input);
	} else {
		throw new Error('Input for GitHub Gists was invalid.');
	}

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
					content: text,
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
