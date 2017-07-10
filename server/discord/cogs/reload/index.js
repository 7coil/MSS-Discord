const config = require('config');
const reload = require('require-reload')(require);
const cogs = require('./../../cogs.js');

module.exports.info = {
	name: 'Reload',
	description: 'Reload a command.',
	category: 'Owner',
	aliases: [
		'reload'
	],
	use: [
		{
			name: '<folder>',
			value: 'Reload a specific cog'
		}
	]
};

module.exports.command = (message) => {
	if (config.get('discord').admins.includes(message.author.id)) {
		try {
			reload(`./../${message.input}/`);
			reload('./../../cogs.js');
			cogs.reload();
			message.channel.createMessage('Reloading...');
		} catch (err) {
			message.channel.createMessage(err.message);
		}
	}
};
