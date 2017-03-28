const Discord = require('discord.js');
const manager = new Discord.ShardManager('./bot.js');
manager.spawn(2);

