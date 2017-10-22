// Get the required shit together
const Discord = require('eris');
const config = require('config');
const { commands } = require('./cogs');
const handler = require('./handler');
const botlist = require('./botlist');

const client = new Discord.Client(config.get('api').discord.token, {
	maxShards: config.get('discord').shards
});

const prefixes = config.get('discord').prefix;

client.once('ready', () => {
	console.log('All shards are online');

	// Set up currently playing game
	client.editStatus('online', {
		name: `${prefixes[0]} help`,
		type: 0
	});

	console.log(client.user);

	setInterval(() => {
		botlist(client);
	}, 1800000);
	botlist(client);

	client.on('messageCreate', (message) => {
		handler(message);
		// Run command if it exists, and if their permissions level is good enough
		if (message.mss.command && message.mss.admin >= commands[message.mss.command].admin) {
			commands[message.mss.command].command(message);
		}
	});
});

client.connect();
module.exports = client;
