const client = require('./../../');

module.exports.info = {
	name: 'Clean messages',
	category: 'utilities',
	aliases: [
		'clean',
		'prune'
	]
};

module.exports.command = (message) => {
	message.channel.getMessages().then((messages) => {
		messages.filter(msg =>
			msg.author.id === client.user.id
		).forEach((msg) => {
			msg.delete();
		});
	});
};
