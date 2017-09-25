// Get the required shit together
const Discord = require('eris');
const config = require('config');
const utils = require('./utils.js');
require('colors');

const client = new Discord.Client(config.get('api').discord.token, {
	maxShards: config.get('discord').shards
});

const prefixes = config.get('discord').prefix;

// Setup commands and util objects.
const commands = require('./cogs.js').cogs;

let prefix = null;

client.on('shardReady', (id) => {
	console.log(`Shard ${id} is online`.green);
});

client.on('ready', () => {
	// Add mentions to the prefix list
	prefixes.push(`<@${client.user.id}>`);

	// Set up regex for the bot.
	// It's "man's essential illness"
	// Use this regex for testing in regexr.com
	// /^(mss).?(ping)\s?([\s\S]*)/
	prefix = new RegExp(`^(${prefixes.join('|')}).?(${Object.keys(commands).join('|')})\\s?([\\s\\S]*)`, 'i');

	console.log('All shards are online'.green.bold);

	// Send DBOTS info if it was provided.
	if (config.get('api').botsdiscordpw) {
		utils.botsdiscordpw(client);
		setInterval(() => {
			utils.botsdiscordpw(client);
		}, 1800000);
	}

	// Send FAKEDBOTS info if it was provided.
	if (config.get('api').discordbotsorg) {
		utils.discordbotsorg(client);
		setInterval(() => {
			utils.discordbotsorg(client);
		}, 1800000);
	}

	// Check for bot collection servers
	utils.collection.check(client);
	setInterval(() => {
		utils.collection.check(client);
	}, 1800000);

	client.on('messageCreate', (message) => {
		// It crashed on this before. No explaination.
		if (!message.author) return;
		// Disallow if the author is a bot
		if (message.author.bot) return;
		// Disallow if not from author if selfbot mode on
		if (config.get('discord').features.selfbot && message.author.id !== client.user.id) return;

		// Test the message content on the regular expression for prefixed commands and the suffixed commands
		const pre = prefix.exec(message.content);

		// If there's a result, do this crap.
		if (pre) {
			// Bake some cool extra crap into the message
			message.prefix = pre[1];
			message.command = pre[2];
			message.input = pre[3] || null;
			message.words = pre[3].split(/\n+|\s+/g);

			// Run the actual command, if the command exists
			commands[message.command.toLowerCase()].command(message, client);
		}
	});
});

client.connect();
module.exports = client;
