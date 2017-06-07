const Discord = require('discord.js');
const config = require('config');

//Do this if it's a real bot
const manager = new Discord.ShardingManager('./server/discord/bot.js', {
	token: config.get("api").discord.bot
});

//Spawn with a relevant number of shards automatically
manager.spawn();
