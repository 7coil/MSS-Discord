const config = require("./../../config.json");
const API = require("./../../api.json");
const MSS = require("./../../functions/");
const Discord = require("discord.js");
const meta = require("./meta.json");
const request = require('request');

module.exports = function help(message) {
	let input = message.content.replace(/\n/g, "").split(" ");
	if(!input[2]) return message.channel.send("No UUID/URL or command supplied.");
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
			} else if(body.entities.length === 1) {
				return message.channel.send(MSS.kahoot.embed(body.entities[0].uuid));
			} else {
				let print = `${body.totalHists} Kahoots found - Select one of the top Kahoots or try again. (10s limit)`
				print += "\n```md"
				body.entities.forEach((item, iterator)=>{
					print += `\n${iterator + 1}. ${item.title}`;
				});
				print += "\n```"

				return message.channel.send(print)
					.then((message)=>{
						message.channel.awaitMessages((m) => {
								let input = m.content.replace(/\n/g, "").split(" ");
								return Number.isInteger(parseInt(input[0])) && parseInt(input[0]) <= body.entities.length && parseInt(input[0]) >= 1 && message.author.id === m.author.id;
							}, {maxMatches: 1, time: 10000, errors: ["time"]})
							.catch((collected) => {
								message.delete();
								if(message.size === 0) return false;
								let input = collected.first.content.replace(/\n/g, "").split(" ");
								message.channel.send(MSS.kahoot.embed(body.entities[parseInt(input[0])].uuid));
							});
					});
			}
		});
		return false;
	}
	if(input[2] === "play") {
		let n = input[3].lastIndexOf('/');
		let id = input[3].substring(n+1);
		return MSS.kahoot.add(message, id);
	}

	message.channel.send("Valid Kahoot commands:\n```\nstop, search, play\n```")

}
