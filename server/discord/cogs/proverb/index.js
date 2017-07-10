const data = require('./data.json');

module.exports.info = {
	name: 'Proverb',
	description: 'Reply with an proverbial response.',
	category: 'Random',
	aliases: [
		'proverb'
	],
	use: [
		{
			name: '',
			value: 'Reply with an 8 bot response'
		}
	]
};

module.exports.command = message =>
	message.channel.createMessage(data.data[Math.floor(Math.random() * data.data.length)]);
