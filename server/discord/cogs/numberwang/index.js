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
	const hash = crypto.createHash('md5').update(message.input + config.get('secret')).digest('hex').substring(0, 4);
	const rank = parseInt(hash, 16) % 2;

	if (rank) {
		message.channel.createMessage('That\'s numberwang!');
	} else {
		message.channel.createMessage(`I'm sorry ${utils.choice(contestants)}, but that's not Numberwang.`);
	}
};
