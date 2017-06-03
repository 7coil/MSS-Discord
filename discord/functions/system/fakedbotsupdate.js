const API = require("./../../config/api.json");
const mss = require("./../../config/mss.json");
const request = require('request');

module.exports = function dbotsupdate(client) {
	let data = {
		url: `https://discordbots.org/api/bots/${client.user.id}/stats`,
		method: "POST",
		json: true,
		headers: {
			"User-Agent": mss.useragent,
			authorization: API.discordbotsorg
		},
		body: {
			server_count: client.guilds.size
		}
	}

	request.post(data);
}
