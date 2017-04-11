const Discord = require("discord.js");
const config = require("./../../config.json");
const request = require('request');
const MSS = require("./../../functions/");
const meta = require("./meta.json");

module.exports = function manpages(message) {
	let input = message.content.replace(/\n/g, " ").split(" ");

	if(input[1] && input[2] && input[3]) {
		reply = {
			response: {
				name: meta.meta.name,
				to: message.author.username,
				error: true,
				output: "The player was not found."
			}
		}

		MSS.msg.xml(message, reply);
		return false;
	}

	//Make the input the correct format
	input[1] = input[1].toLowerCase();
	input[2] = input[2].toLowerCase();
	input[3] = input[3].replace("#", "-");
	var owUrl = "http://127.0.0.1:3000/profile/" + input[1] + "/" + input[2] + "/" + input[3];
	request(owUrl, function (error, response, body) {
		if (response.statusCode === 404) {
			reply = {
				response: {
					name: meta.meta.name,
					to: message.author.username,
					error: true,
					output: "The player was not found."
				}
			}

			MSS.msg.xml(message, reply);
		} else if (response.statusCode === 200){
			var owData = JSON.parse(body);

			reply = {
				response: {
					name: meta.meta.name,
					to: message.author.username,
					error: false,
					output: owData
				}
			}

			MSS.msg.xml(message, reply);
		}
	});
}
