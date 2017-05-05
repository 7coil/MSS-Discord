const Discord = require('discord.js');
const config = require('./config.json');
const API = require("./api.json");
const exec = require("child_process").exec;

if(!config.MSS.selfbot) {

	//Do this if it's a real bot
	const manager = new Discord.ShardingManager('./bot.js', {
		token: API.discord
	});

	//Spawn with a relevant number of shards automatically
	manager.spawn();

} else {
	console.log("You are running in SELFBOT mode. This is not an officially supported mode, and we don't recommend you do this.");
	console.log("To continue, run > node bot.js <");
}
