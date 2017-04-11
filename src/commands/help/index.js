const config = require("./../../config.json");
const Discord = require("discord.js");
const meta = require("./meta.json");
const MSS = require("./../../functions/");

module.exports = function help(message) {

	reply = {
		response: {
			name: meta.meta.name,
			to: message.author.username,
			error: false,
			output: {
				help: [
					"For a list of commands, run man, with option of 'all'.",
					"For help on a specific command, run man, with the option of your choice.",
					"This version of MSS-Discord (XML-Discord) is by 7coil, at moustacheminer.com",
					"This software is released under the MIT Licence"
				]
			}
		}
	}

	MSS.msg.xml(message, reply);
}
