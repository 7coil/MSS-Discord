const Discord = require("discord.js");
const MSS = require("./../../functions/");
const config = require("./../../config.json");
const meta = require("./meta.json");
const fs = require("fs");
var commands = [];
var list = [];

//Get all .json files in this directory to read the man data.
fs.readdir("./commands/", function(err, items) {
	items.forEach(function(item) {
		list.push(file);
		commands[file] = require("./../" + file + "/meta.json");
	});
});

module.exports = function manpages(message) {
	let input = message.content.replace(/\n/g, " ").split(" ");

	//Return the usage of the man command if no attributes were given
	if(!input[1]) {
		print = {
			response: {
				name: meta.meta.name,
				to: message.author.username,
				error: false,
				output: "What manual page do you want?",
				option: list
			}
		}
		MSS.msg.xml(message, print);
		return false;
	}

	//Return if it doesn't exist
	if (!commands[input[1]]) {
		reply = {
			response: {
				name: meta.meta.name,
				to: message.author.username,
				error: true,
				output: "The page does not exist."
			}
		}

		MSS.msg.xml(message, reply);
		return false;
	}

	reply = {
		response: {
			name: meta.meta.name,
			to: message.author.username,
			error: false,
			output: {
				"name": commands[input[1]].meta.name,
				"description": commands[input[1]].meta.description,
				"url": commands[input[1]].meta.url
			}
		}
	}

	MSS.msg.xml(message, reply);
}

