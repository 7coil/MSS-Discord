const data = require('./data.json');

module.exports.info = {
	name: 'Magic 8 Ball',
	description: 'Reply with an 8 Ball response.',
	category: 'Random',
	aliases: [
		'8',
		'8-ball'
	],
	use: [
		{
			name: '[input]',
			value: 'Reply with an 8 bot response'
		}
	]
};

module.exports.command = message =>
	message.channel.createMessage(data.data[Math.floor(Math.random() * data.data.length)]);
