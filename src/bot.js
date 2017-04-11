//Get the required shit together
const config = require("./config.json");
const API = require("./api.json");
const Discord = require("discord.js");
const client = new Discord.Client();
const MSS = require("./functions/");
const fs = require("fs");
const xml2js = require('xml2js');
const xmlparse = xml2js.parseString;

var command = [];

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

client.on("ready", function() {
	console.log("Successfully connected to Discord!");
	client.user.setGame("<command>man</command>");
});

client.on("message", function(message) {

	//Remove newlines
	message.content = message.content.replace("\n", "");

	//Remove beautiful Discord code marks if it's there
	if(message.content.toLowerCase.startsWith("```xml")) {
		message.content = message.content.substring(6).slice(0, -3);
	} else if (message.content.startsWith("```")) {
		message.content = message.content.substring(3).slice(0, -3);
	}

	console.log(message.content);

	//Stop if it's not a XML command
	if(!message.content.startsWith("<command>")) return false;

	xmlparse(message.content, function(err, result) {
		if(err) {
			console.log(err);
		}

		console.dir(result);
	});


});

process.on("unhandledRejection", function(err) {
  console.error("Uncaught Promise Error: \n" + err.stack);
});
