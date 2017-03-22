//A one dimensional array for each API key.
//api[keyname]
var api = [];

//Get the configuration file
var config = require("./config.json");
console.dir(config);

//Declare the Discord and client constants used to set up the Discord bot
const Discord = require("discord.js");
const client = new Discord.Client();
client.login(config.API.discord);

client.on('ready', function() {
	console.log("Successfully connected to Discord!");
	client.user.setGame("MSS Version: " + config.MSS.version);
});

client.on('message', function(message) {
	//if(message.content.startsWith(config.MSS.prefix);
	//let input = message.content.replace (/\n/g, "").split(" ");
});