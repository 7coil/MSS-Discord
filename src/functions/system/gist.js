const API = require("./../../api.json");
const request = require('request');

module.exports = function dbotsupdate(client) {
	let data = {
		url: `https://bots.discord.pw/api/bots/${client.user.id}/stats`,
		method: "POST",
		json: true,
		headers: {
			authorization: API.dBots
		},
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
		if (error) {
			return "Error in posting GitHub Gist";
		}

		return JSON.parse(body).url;
	});
}
