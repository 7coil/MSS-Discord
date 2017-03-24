//Get the required shit together
const config = require("./config.json");
const Discord = require("discord.js");
const client = new Discord.Client();
const MSS = require("./functions/");
const fs = require("fs");
var command = [];
var reaction = [];

//Login to Discord
client.login(config.API.discord);

//Include all files in the commands directory for commands
fs.readdir("./commands/", function(err, items) {
	items.forEach(function(item) {
		var file = item.replace(/['"]+/g, "");
		if (file.endsWith(".js")) {
			file = file.replace(".js", "");
			console.log(file);
			command[file] = require("./commands/" + file);
		}
	});
	//List all avaliable commands
	//console.dir(command);
});

//Include all files in the commands directory for reactions
fs.readdir("./reactions/", function(err, items) {
	items.forEach(function(item) {
		var file = item.replace(/['"]+/g, "");
		if (file.endsWith(".js")) {
			file = file.replace(".js", "");
			console.log(file);
			reaction[file] = require("./reactions/" + file);
		}
	});
	//List all avalible reactions
	//console.dir(reaction);
});



client.on("ready", function() {
	console.log("Successfully connected to Discord!");
	client.user.setGame(config.MSS.prefix + "help | " + config.MSS.version);
});

client.on("message", function(message) {
	if (message.author.bot) return;
	if (!message.guild) return MSS.msg.rich(message, "Error", "You are not allowed to send commands via Direct Messaging. If you are trying to invite this bot, please goto: http://moustacheminer.com/r/invite-bot", "#FF0000");
	
	if (!message.content.startsWith(config.MSS.prefix)) return false;
	let input = message.content.replace (/\n/g, "").split(" ");
	input[0] = input[0].substring(config.MSS.prefix.length);
	
	if (command[input[0]]) {
		command[input[0]](message);
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
		reaction[input](messageReaction, user);
	}
});
