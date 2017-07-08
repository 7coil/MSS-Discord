const config = require('config');
const crypto = require('crypto');
const utils = require('./../../utils.js');

const contestants = [
	'Julie',
	'Simon'
];

module.exports.info = {
	name: 'Numberwang',
	category: 'Fun',
	aliases: [
		'numberwang'
	]
};

module.exports.command = (message) => {
	const rank = parseInt(crypto.createHash('sha512').update(message.input + config.get('secret')).digest('hex'), 16) % 2;

	if (rank) {
		message.channel.createMessage('That\'s numberwang!');
	} else {
		message.channel.createMessage(`I'm sorry ${utils.choice(contestants)}, but that's not Numberwang.`);
	}
};
