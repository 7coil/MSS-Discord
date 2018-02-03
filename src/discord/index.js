// Get the required shit together
const Discord = require('eris');
const config = require('config');
const { commands } = require('./cogs');
const handler = require('./handler');
const { PlayerManager } = require('eris-lavalink');

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

	if (!(client.voiceConnections instanceof PlayerManager)) {
		client.voiceConnections = new PlayerManager(client, config.get('lavalink'), {
			numShards: config.get('discord').shards,
			userId: client.user.id,
			defaultRegion: 'eu'
		});
	}
});

client.on('messageCreate', m => handler(m).then((message) => {
	if (message.h.command && commands[message.h.command].guild && !message.member) {
		message.channel.createMessage(message.__('err_guild'));
	} else if (message.h.command && message.h.permission <= commands[message.h.command].permission) {
		commands[message.h.command].command(message);
	}
}));

client.connect();
module.exports = client;
