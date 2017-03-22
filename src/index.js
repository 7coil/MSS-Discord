//Sets the version number for MSS-Discord
const version = "Exports Branch";

//A one dimensional array for each API key.
//api[keyname]
var api = [];

//Get the Discord API Key.
api["discord"] = process.argv[2] || {process.exitCode = 2;}

//Declare the Discord and client constants used to set up the Discord bot
const Discord = require("discord.js");
const client = new Discord.Client();
client.login(api["discord"]);

client.on('ready', function() {
	console.log("Successfully connected to Discord!");
	client.user.setGame("MSS Version: " + version);
});