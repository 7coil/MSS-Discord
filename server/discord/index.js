// Get the required shit together
const Discord = require('eris');
const config = require('config');
const utils = require('./utils.js');

const client = new Discord.Client(config.get('api').discord.token, { maxShards: config.get('shards') });
const prefixes = config.get('prefix');
let regex = null;

// Setup commands and util objects.
const commands = require('./cogs.js');

// Just plop all valid commands in for other cogs to look at it.
client.commands = commands;

client.on('ready', () => {
	// Set up regex for the bot.
	// It's "man's essential illness"
	// Use this regex for testing in regexr.com
	// /^(mss).?(ping)\s?([\s\S]*)/
	regex = new RegExp(`^(${prefixes.join('|')}).?(${Object.keys(commands).join('|')})\\s?([\\s\\S]*)`);

	// Add mentions to the prefix list
	prefixes.push(`<@${client.user.id}>`);
	console.log('Connected to Discord!');

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
});

client.on('messageCreate', (message) => {
	// Disallow if the author is a bot
	if (message.author.bot) return;

	// Test the message content on the regular expression
	const result = regex.exec(message.content);

	// Return if it fails the regex commands check test
	if (!result) return;

	// Bake some cool extra crap into the message
	message.prefix = result[1];
	message.command = result[2];
	message.input = result[3] || null;
	message.words = result[3].split(/\n+|\s+/g);

	// Run the actual command
	commands[message.command].command(message, client);
});

// Connect to Discord
console.log('Discord loaded');
client.connect();

module.exports = client;
