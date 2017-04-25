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
			server_count: client.guilds.size
		}
	}
	
	request.post(body);
}
