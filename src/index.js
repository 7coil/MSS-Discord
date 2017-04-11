const Discord = require('discord.js');
const config = require('./config.json');
const manager = new Discord.ShardingManager('./bot.js');

manager.spawn(config.MSS.shards);
