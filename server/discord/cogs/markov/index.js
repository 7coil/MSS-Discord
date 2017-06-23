const utils = require('./../../utils.js');

module.exports.alias = [
	'markov'
];

module.exports.command = (message) => {
	if (message.words[0] === 'register') {
		if (message.words[1]) {
			utils.markov.register(message.user.id, message.words[1], (reply) => {
				message.channel.createMessage(reply);
			});
		} else {
			message.channel.createMessage('You did not supply a name. The name is what triggers the [whatever]pls Markov generator.');
		}
	} else if (message.words[0] === 'unregister') {
		utils.markov.unregister(message.user.id, (reply) => {
			message.channel.createMessage(reply);
		});
	}
};
