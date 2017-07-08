const config = require('config');
const client = require('./../../'); // eslint-disable-line no-unused-vars
const utils = require('./../../utils.js');

module.exports.info = {
	name: 'JavaScript Evaluation',
	category: 'Development',
	aliases: [
		'eval'
	]
};

module.exports.command = (message) => {
	if (config.get('discord').admins.includes(message.author.id)) {
		if (!message.input) {
			message.channel.send('No input detected');
		} else {
			try {
				eval(message.input); // eslint-disable-line no-eval
			} catch (err) {
				utils.gist(err.stack, (url) => {
					message.channel.createMessage(`**Fatal Error!:** ${url}`);
				});
			}
		}
	}
};
