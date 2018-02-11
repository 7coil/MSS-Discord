// Get the required shit together
const Discord = require('eris');
const config = require('config');

const client = new Discord.Client(config.get('api').discord.token, {
	maxShards: config.get('discord').shards
});

client.once('ready', () => {
	console.log('All shards are online');
});

client.on('messageCreate', (message) => {
	console.log(message.content);
});

client.connect();
