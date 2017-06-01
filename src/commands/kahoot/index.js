const config = require("./../../config.json");
const API = require("./../../api.json");
const MSS = require("./../../functions/");
const Discord = require("discord.js");
const meta = require("./meta.json");
const request = require('request');

module.exports = function help(message) {
	let input = message.content.replace(/\n/g, "").split(" ");
	if(input[2] === "stop") return MSS.kahoot.stop(message);
	if(input[2] === "search") {
		input.shift();
		input.shift();
		input.shift();
		let search = encodeURIComponent(input.join(" "));
		let data = {
			url: `https://create.kahoot.it/rest/kahoots/search/public?query=${search}&limit=5`,
			json: true,
			headers: {
				"User-Agent": config.MSS.useragent,
				Authorization: API.kahoot
			}
		}
		request.get(data, (err, res, body) => {
			if(err) return message.channel.send("Request error!");
			if(body.error) return message.channel.send(body.error);
			if(body.entities.length === 0) {
				return message.reply("No Kahoots found.");
			} else {
				return message.channel.send(`${body.totalHits} Kahoots found - Displaying top result`,MSS.kahoot.embed(body.entities[0]));
			}
		});
		return false;
	}
	if(input[2] === "play") {
		let n = input[3].lastIndexOf('/');
		let id = input[3].substring(n+1);
		return MSS.kahoot.add(message, id);
	}

	message.channel.send("Invalid subcommand! Run `@MSS man kahoot` for all subcommands");

}
