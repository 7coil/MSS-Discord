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
	//It's a selfbot. Just start it up.
	exec('node ./bot.js');
}
