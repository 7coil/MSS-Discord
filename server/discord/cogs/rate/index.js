const config = require('config');
const crypto = require('crypto');

module.exports.info = {
	name: 'Rate and Rank',
	category: 'fun',
	aliases: [
		'rate',
		'rank'
	]
};

module.exports.command = (message) => {
	if (!message.input) return message.channel.createMessage(`I ${message.command} undefined an 11 out of 10`);
	const input = message.input.replace(/\W/g, '');
	const thing = message.input.length < 100 ? input : `${input.substring(0, 100)}...`;
	const rank = parseInt(crypto.createHash('sha512').update(input.toLowerCase() + config.get('secret')).digest('hex'), 16) % 11;
	return message.channel.createMessage(`I ${message.command} ${thing} a ${rank} out of 10`);
};
