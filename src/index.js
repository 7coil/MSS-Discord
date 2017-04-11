const Discord = require('discord.js');
const config = require('./config.json');
const API = require("./api.json");
const manager = new Discord.ShardingManager('./bot.js', {
	token: API.discord
});

//Spawn with a relevant number of shards automatically
manager.spawn();
