const API = require("./../../config/api.json");
const request = require('request');
const mss = require("./../../config/mss.json");

module.exports = function dbotsupdate(client) {
	let data = {
		url: `https://bots.discord.pw/api/bots/${client.user.id}/stats`,
		method: "POST",
		json: true,
		headers: {
			"User-Agent": mss.useragent,
			authorization: API.dBots
		},
		body: {
			server_count: client.guilds.size
		}
	}

	request.post(data);
}
