const utils = require('./../../utils.js');

module.exports.info = {
	name: 'Un-register from Markov',
	description: 'Un-register for Markov based messaging.',
	category: 'Fun',
	aliases: [
		'mkunregister'
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
	utils.markov.unregister(message.author.id, (reply) => {
		message.channel.createMessage(reply);
	});
};
