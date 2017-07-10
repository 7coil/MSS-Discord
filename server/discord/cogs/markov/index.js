const utils = require('./../../utils.js');

module.exports.info = {
	name: 'Markov Message Chains',
	description: 'Register for Markov based messaging. Stores messages you send, but in such a way that only analytics about the data is stores, so complies with EU and UK data protection policies.',
	category: 'Fun',
	aliases: [
		'markov'
	],
	use: [
		{
			name: 'register',
			value: 'Register for the Markov machine learning service'
		}, {
			name: 'unregister',
			value: 'Remove yourself and your data from the Markov machine learning service'
		}
	]
};

module.exports.command = (message) => {
	if (message.words[0] === 'register') {
		if (message.words[1]) {
			utils.markov.register(message.author.id, message.words[1], (reply) => {
				message.channel.createMessage(reply);
			});
		} else {
			message.channel.createMessage('You did not supply a name. The name is what triggers the [whatever]pls Markov generator.');
		}
	} else if (message.words[0] === 'unregister') {
		utils.markov.unregister(message.author.id, (reply) => {
			message.channel.createMessage(reply);
		});
	}
};
