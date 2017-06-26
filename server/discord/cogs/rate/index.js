const crypto = require('crypto');

module.exports.alias = [
	'rate',
	'rank'
];

module.exports.command = function screenshot(message) {
	if (!message.input) return message.channel.createMessage(`I ${message.command} undefined an 11 out of 10`);
	const input = message.input.replace(/‌/g);
	const thing = message.input.length < 100 ? input : `${input.substring(0, 100)}...`;
	const rank = parseInt(crypto.createHash('md5').update(thing.toLowerCase()).digest('hex'), 16) % 11;
	return message.channel.createMessage(`I ${message.command} ${thing} a ${rank} out of 10`);
};
