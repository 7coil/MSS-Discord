module.exports.info = {
	name: '🍌',
	description: '🍌🍌🍌🍌🍌🍌🍌🍌🍌🍌🍌🍌🍌.',
	category: 'Random',
	aliases: [
		'🍌',
		'banana',
		':banana:'
	],
	use: [
		{
			name: '',
			value: '🍌🍌🍌, 🍌🍌🍌. 🍌🍌! 🍌🍌🍌🍌🍌?'
		}
	]
};

module.exports.command = message =>
	message.channel.createMessage('🍌');
