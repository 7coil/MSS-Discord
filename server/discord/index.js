// Get the required shit together
const Discord = require('eris');
const config = require('config');

const client = new Discord.Client(config.get('api').discord.token, { maxShards: config.get('shards') });
const prefixes = config.get('prefix');
let regex = null;

// Setup commands and util objects.
const commands = require('./cogs.js');
client.utils = require('./utils.js');

// Just plop all valid commands in for other cogs to look at it.
client.commands = commands;

client.on('ready', () => {
	// Set up regex for the bot.
	regex = new RegExp(`(${prefixes.join('|')}).?(${Object.keys(commands).join('|')})\\s?(.*)`);

	// Add mentions to the prefix list
	prefixes.push(`<@${client.user.id}>`);
});

client.on('messageCreate', (message) => {
	// Disallow if the author is a bot
	if (message.author.bot) return;

	// Test the message content on the regular expression
	const result = regex.exec(message.content);

	// Return if it fails the regex commands check test
	if (!result) return;

	// Bake some cool extra crap into the message
	/* eslint-disable no-param-reassign */
	message.prefix = result[1];
	message.command = result[2];
	message.input = result[3] || null;
	message.words = result[3].split(/\n+|\s+/g);
	/* eslint-enable no-param-reassign */

	// Run the actual command
	commands[message.command].command(message, client);
});

// Connect to Discord
client.connect();
