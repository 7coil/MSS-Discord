//Get the required shit together
const config = require("./config.json");
const API = require("./api.json");
const Discord = require("discord.js");
const client = new Discord.Client();
const MSS = require("./functions/");
const request = require('request');
const fs = require("fs");
var command = [];
var reaction = [];

//Login to Discord
client.login(API.discord);

//Include all files in the commands directory for commands
fs.readdir("./commands/", function(err, items) {
	items.forEach(function(item) {
		var file = item.replace(/['"]+/g, "");
		console.log(file);
		command[file] = require("./commands/" + file + "/");
	});
});

//Include all files in the commands directory for reactions
fs.readdir("./reactions/", function(err, items) {
	items.forEach(function(item) {
		var file = item.replace(/['"]+/g, "");
		if (file.endsWith(".js")) {
			file = file.replace(".js", "").toLowerCase();
			console.log(file);
			reaction[file] = require("./reactions/" + file);
		}
	});
	//List all avalible reactions
	//console.dir(reaction);
});



client.on("ready", function() {
	console.log("Successfully connected to Discord!");
	
	if (config.MSS.selfbot) {
		console.log("Selfbot mode activated");
	} else {
		client.user.setGame("http://mss.ovh/ | " + config.MSS.version);
		
		MSS.system.dbotsupdate(client);
		setInterval(() => {
			MSS.system.dbotsupdate(client);
		}, 1800000);
	}
	
});

client.on("message", function(message) {

	//Split message into keywords
	let input = message.content.replace(/\n/g, "").split(" ");

	//Disallow if the author is a bot
	if (message.author.bot) return;

	//If it's a selfbot, check if the message is from itself
	if (config.MSS.selfbot && !(message.author.id === client.user.id)) return;

	//If the first input contains the mention, let it through
	if (input[0].indexOf(client.user.id) === -1) return;
	
	//If the command exists, run the command
	if (command[input[1]]) {
		command[input[1]](message);
	}
});

client.on("messageReactionAdd", function(messageReaction, user) {
	//Not on other's messages
	if(!(messageReaction.message.author.id === client.user.id)) return;

	//Not if the author is a bot
	if (user.bot) return;

	//Get decimal codepoint of emoji
	var input = messageReaction.emoji.name.codePointAt().toString();

	console.log(input);

	if (reaction[input]) {
		try {
			reaction[input](messageReaction, user);
		} catch(err) {
			message.channel.sendMessage(`We fucked up! ${err.message}`)
		}

	}
});

process.on("unhandledRejection", function(err) {
  console.error("Uncaught Promise Error: \n" + err.stack);
});
