const Discord = require('discord.js');
const manager = new Discord.ShardingManager('./bot.js');
manager.spawn(2);
