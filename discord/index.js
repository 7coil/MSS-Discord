const Discord = require('discord.js');
const api = require("./config/api.json");

//Do this if it's a real bot
const manager = new Discord.ShardingManager('./bot.js', {
	token: api.discord
});

//Spawn with a relevant number of shards automatically
manager.spawn();
