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
	if (!message.content.startsWith(config.MSS.prefix) return false;
	let input = message.content.replace (/\n/g, "").split(" ");
});