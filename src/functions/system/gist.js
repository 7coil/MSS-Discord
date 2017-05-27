const request = require('request');

module.exports = function gist(input) {
	let data = {
		url: `https://api.github.com/gists`,
		method: "POST",
		json: true,
		headers: {
			"User-Agent": "Moustacheminer Server Services"
		},
		body: {
			"description": "the description for this gist",
			"public": true,
			"files": {
				"mss.txt": {
					"content": input
				}
			}
		}
	}

	request.post(data, (err, res, body) => {
		if (err) {
			return "Error in posting GitHub Gist";
		}

		return body.files["mss.txt"].raw_url;
	});
}
