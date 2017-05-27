const request = require('request');

module.exports = function gist() {
	let data = {
		url: `https://api.github.com/gists`,
		method: "POST",
		json: true,
		body: {
			"description": "the description for this gist",
			"public": true,
			"files": {
				"file1.txt": {
					"content": "String file contents"
				}
			}
		}
	}

	request.post(data, (err, res, body) => {
		if (err) {
			return "Error in posting GitHub Gist";
		}

		console.log(body);
	});
}
