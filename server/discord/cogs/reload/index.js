const config = require('config');
const reload = require('require-reload')(require);
const cogs = require('./../../cogs.js');

module.exports.info = {
	name: 'Reload',
	category: 'development',
	aliases: [
		'reload'
	]
};

module.exports.command = (message) => {
	if (config.get('admins').includes(message.author.id)) {
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
