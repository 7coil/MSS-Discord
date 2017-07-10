const data = require('./data.json');

module.exports.info = {
	name: 'Fortune Cookie',
	description: 'Reply with a fortune cookie response.',
	category: 'Random',
	aliases: [
		'cookie'
	],
	use: [
		{
			name: '',
			value: 'Reply with an fortune cookie response'
		}
	]
};

module.exports.command = message =>
	message.channel.createMessage(data.data[Math.floor(Math.random() * data.data.length)]);
