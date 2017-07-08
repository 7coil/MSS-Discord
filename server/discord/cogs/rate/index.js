const config = require('config');
const crypto = require('crypto');

module.exports.info = {
	name: 'Rate and Rank',
	category: 'Fun',
	aliases: [
		'rate',
		'rank'
	]
};

module.exports.command = (message) => {
	if (message.input) {
		const input = message.input.replace(/\W/g, '');
		const hash = crypto.createHash('md5').update(input + config.get('secret')).digest('hex').substring(0, 4);
		const rank = parseInt(hash, 16) % 2;
		const thing = message.input.length < 100 ? input : `${input.substring(0, 100)}...`;
		message.channel.createMessage(`I ${message.command} ${thing} a ${rank} out of 10`);
	}
};
