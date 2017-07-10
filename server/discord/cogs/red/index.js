const config = require('config');
const cogs = require('./../../cogs.js').cogs;

const column = 14;

const capitalise = string =>
	string.charAt(0).toUpperCase() + string.slice(1);

module.exports.info = {
	name: 'Commands',
	description: 'Displays the full automatically generated commands list.',
	category: 'Info',
	aliases: [
		'commands',
		'red'
	],
	use: [
		{
			name: '',
			value: 'Obtain a list of commands'
		}
	]
};

module.exports.command = (message) => {
	const categories = {};
	const commands = [];

	// Get the categories for each bot
	Object.keys(cogs).forEach((key) => {
		// If the category doesn't exist, make an array for it
		if (!categories[cogs[key].info.category]) categories[cogs[key].info.category] = [];

		if (!commands.includes(cogs[key].info.aliases[0])) {
			commands.push(cogs[key].info.aliases[0]);
			categories[cogs[key].info.category].push({
				command: key,
				description: cogs[key].info.name
			});
		}
	});

	let reply = '```\n';
	reply += `${config.get('name')} is a bot with many random features.\n`;
	reply += `Available prefixes are: ${config.get('discord').prefix.join(', ')}\n`;

	Object.keys(categories).forEach((key) => {
		reply += `${capitalise(key)}:\n`;
		categories[key].forEach((command) => {
			const spaces = column - command.command.length;
			reply += '  ';
			reply += command.command;

			// Fill in spaces to the description
			let i = 0;
			do {
				i += 1;
				reply += ' ';
			} while (i < spaces);

			reply += command.description;
			reply += '\n';
		});
	});

	reply += `\nType ${message.prefix} ${message.command} command for no info on a command.\n`;
	reply += `You cannot type ${message.prefix} ${message.command} category for more info on a category.\n`;
	reply += '\n```';

	// Send the REDBOT reply
	message.channel.createMessage(reply);
};
