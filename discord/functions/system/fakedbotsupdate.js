const API = require("./../../config/api.json");
const request = require('request');

module.exports = function dbotsupdate(client) {
	let data = {
		url: `https://discordbots.org/api/bots/${client.user.id}/stats`,
		method: "POST",
		json: true,
		headers: {
			authorization: API.fakedBots
		},
		body: {
			server_count: client.guilds.size
		}
	}

	request.post(data);
}
