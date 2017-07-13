const utils = require('./../../utils.js');

module.exports.info = {
	name: 'Register from Markov',
	description: 'Register for Markov based messaging. Stores messages you send, but in such a way that only analytics about the data is stores, so complies with EU and UK data protection policies.',
	category: 'Fun',
	aliases: [
		'mkregister'
	],
	use: [
		{
			name: '',
			value: 'Register for the Markov machine learning service'
		}
	]
};

module.exports.command = (message) => {
	if (message.words[1]) {
		utils.markov.register(message.author.id, message.words[1], (reply) => {
			message.channel.createMessage(reply);
		});
	} else {
		message.channel.createMessage('You did not supply a name. The name is what triggers the [whatever]pls Markov generator.');
	}
};
