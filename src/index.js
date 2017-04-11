const Discord = require('discord.js');
const config = require('./config.json');
const manager = new Discord.ShardingManager('./bot.js');

//Spawn with a relevant number of shards automatically
manager.spawn();
