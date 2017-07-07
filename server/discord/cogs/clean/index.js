const client = require('./../../');
const utils = require('./../../utils.js');

const regex = /\w+/;

module.exports.info = {
	name: 'Clean messages by MSS',
	category: 'utilities',
	aliases: [
		'clean',
		'prune'
	]
};

module.exports.command = (message) => {
	if (utils.isadmin(message.member)) {
		const prune = message.input ? regex.exec(message.input) : client.user.id;
		message.channel.getMessages().then((messages) => {
			messages.filter((msg) => {
				if (prune === 'bots') {
					return msg.author.bot;
				}
				return msg.author.id === prune;
			}).forEach((msg) => {
				msg.delete().catch(() => {
					console.log('Insufficient permissions (probably)');
				});
			});
		});
	} else {
		message.channel.createMessage('You do not have permission to perform this command!');
	}
};
