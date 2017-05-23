//Get the required shit together
const config = require("./config.json");
const API = require("./api.json");
const Discord = require("discord.js");
const client = new Discord.Client();
const MSS = require("./functions/");
const request = require('request');
const fs = require("fs");
const rethonk = require('rethinkdbdash')({
  pool: false,
  cursor: true
});
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
	
	//Return if a selfbot
	if (config.MSS.selfbot) return console.log("Selfbot mode activated");

	//Set current game to URL and version
	client.user.setGame("http://mss.ovh/ | " + config.MSS.version);

	//Send DBOTS info if it was provided.
	if (API.dBots) {
		MSS.system.dbotsupdate(client);
		setInterval(() => {
			MSS.system.dbotsupdate(client);
		}, 1800000);
	}

	//Send FAKEDBOTS info if it was provided.
	if (API.fakedBots) {
		MSS.system.fakedbotsupdate(client);
		setInterval(() => {
			MSS.system.fakedbotsupdate(client);
		}, 1800000);
	}

	//Create a RethonkDB connection
	rethonk.connect({host: "localhost", port: 28015, db: "discord"}, (err, conn) => {
		if (err) throw err;
		client.rethonk = conn;
	});
});

client.on("message", function(message) {

	//Split message into keywords
	let input = message.content.replace(/\n/g, "").split(" ");

	//Disallow if the author is a bot
	if (message.author.bot) return;

	//If it's a selfbot, check if the message is from itself
	if (config.MSS.selfbot && !(message.author.id === client.user.id)) return;

	//Check if it has the correct prefix
    if (!input[0].includes(client.user.id)) return;

	//If the command exists and a prefix matches, run the command
	if (command[input[1]]) {
		//Get data for the user, and add to message
		rethonk.table("users").get(message.author.id).run(client.rethonk, (err, result) => {
			if (err) throw err;
			message.data = result || {"lang": "en"};
		}).then(()=> {
			command[input[1]](message);
		})



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
		rethonk.table("users").get(user.id).run(client.rethonk, (err, result) => {
			if (err) throw err;
			messageReaction.message.data = result || {"lang": "en"};
		}).then(()=> {
			reaction[input](messageReaction, user);
		})
	}
});

process.on("unhandledRejection", function(err) {
  console.error("Uncaught Promise Error: \n" + err.stack);
});
