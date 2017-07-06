// Get the required shit together
const Discord = require('eris');
const config = require('config');
const utils = require('./utils.js');
require('colors');

// Database
const r = require('./../db');

const client = new Discord.Client(config.get('api').discord.token, { maxShards: config.get('shards') });
const prefixes = config.get('prefix');

// Setup commands and util objects.
const commands = require('./cogs.js').cogs;

// Set up regex for the bot.
// It's "man's essential illness"
// Use this regex for testing in regexr.com
// /^(mss).?(ping)\s?([\s\S]*)/
// /(\w+)rly/
const prefix = new RegExp(`^(${prefixes.join('|')}).?(${Object.keys(commands).join('|')})\\s?([\\s\\S]*)`);
const suffix = /(\w+)pls/;

client.on('shardReady', (id) => {
	console.log(`Shard ${id} is online`.green);
});

client.on('ready', () => {
	// Add mentions to the prefix list
	prefixes.push(`<@${client.user.id}>`);
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
});

client.on('messageCreate', (message) => {
	// It crashed on this before. No explaination.
	if (!message.author) return;
	// Disallow if the author is a bot
	if (message.author.bot) return;

	// Test the message content on the regular expression for prefixed commands and the suffixed commands
	const pre = prefix.exec(message.content);
	const suf = suffix.exec(message.content);

	// If there's a result, do this crap.
	if (pre) {
		// Bake some cool extra crap into the message
		message.prefix = pre[1];
		message.command = pre[2];
		message.input = pre[3] || null;
		message.words = pre[3].split(/\n+|\s+/g);

		// Run the actual command
		commands[message.command].command(message, client);
	} else if (suf) {
		if (message.channel && message.channel.id !== '110373943822540800') {
			// If the suffix matches a user's name in the database...
			r.table('markov')
				.filter({ name: suf[1] })
				.run(r.conn, (err1, cursor) => {
					if (err1) return;
					cursor.toArray((err2, result) => {
						if (err2) return;
						if (result.length === 0) return;
						// Generate a Markov
						utils.markov.generate(suf[1], (embed) => {
							message.channel.createMessage(embed);
						});
					});
				});
		}
	} else {
		// If the user exists in the rethonk Markov database...
		r.table('markov')
			.filter({ author: message.author.id })
			.run(r.conn, (err1, cursor) => {
				if (err1) return;
				cursor.toArray((err2, result) => {
					if (err2) return;
					if (result.length === 0) return;
					// Save the markov.
					utils.markov.save(message);
				});
			});
	}
});

client.connect();
module.exports = client;
