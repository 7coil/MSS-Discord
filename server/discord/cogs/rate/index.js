const config = require('config');
const crypto = require('crypto');

module.exports.info = {
	name: 'Rate and Rank',
	description: 'Interprets and determines the relevant rank for a query',
	category: 'Fun',
	aliases: [
		'rate',
		'rank'
	],
	use: [
		{
			name: '',
			value: 'Rate the empty air of silence after you and your children\'s deaths, past the end of civilisation, past the end of our Sun, past the heat death of the universe, and is at a global temperature of absolute zero.'
		}, {
			name: '<thing>',
			value: 'Rate the thing'
		}
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
