//Get the required shit together
const config = require("./config.json");
const Discord = require("discord.js");
const glob = require("glob");
const path = require("path");
const client = new Discord.Client();
const MSS = require("./functions/");

//Login to Discord
client.login(config.API.discord);


client.on('ready', function() {
	console.log("Successfully connected to Discord!");
	client.user.setGame("MSS Version: " + config.MSS.version);
});

client.on('message', function(message) {
	if (!message.content.startsWith(config.MSS.prefix)) return false;
	let input = message.content.replace (/\n/g, "").split(" ");
	input[0] = input[0].substring(config.MSS.prefix.length);
	
	if (input[0] === "eval" && message.author.id === "190519304972664832") {
		eval(message.content.substring(config.MSS.prefix.length + input[0].length + 1));
	}
});
