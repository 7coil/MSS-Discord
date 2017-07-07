const client = require('./../../');
const utils = require('./../../utils.js');

module.exports.info = {
	name: 'Clean messages by MSS',
	category: 'utilities',
	aliases: [
		'clean',
		'prune'
	]
};

module.exports.command = (message) => {
	console.log(message.input);
	if (utils.isadmin(message.member)) {
		const regex = /\w+/g;
		let fail = false;

		const input = regex.exec(message.input);
		console.dir(input);
		let prune = '';

		if (input && input[0] && message.input) {
			prune = input[0];
		} else {
			prune = client.user.id;
		}

		console.log(prune);
		message.channel.getMessages().then((messages) => {
			messages.filter((msg) => {
				if (prune === 'bots') {
					return msg.author.bot;
				}
				return msg.author.id === prune;
			}).forEach((msg) => {
				msg.delete();
			});
		});
	} else {
		message.channel.createMessage('You do not have permission to perform this command!');
	}
};
