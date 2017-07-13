const config = require('config');
const cogs = require('./../../cogs.js').cogs;

module.exports.info = {
	name: 'MusicBot like commands list',
	description: 'Obtain a list of commands in a MusicBot format',
	category: 'Info',
	aliases: [
		'musicbot',
	],
	use: [
		{
			name: '',
			value: 'Obtain a list of commands in a MusicBot format'
		}
	]
};

module.exports.command = (message) => {
	let reply = `<@${message.author.id}>, **Commands**\n\`\`\`\n`;
	reply += Object.keys(cogs).map(name => config.get('discord').prefix[0] + name).join(', ');

	reply += '\n```\n';
	reply += config.get('url').github;

	// Send the REDBOT reply
	message.channel.createMessage(reply);
};
