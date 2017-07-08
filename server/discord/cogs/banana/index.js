module.exports.info = {
	name: '🍌',
	category: 'Random',
	aliases: [
		'🍌',
		'banana',
		':banana:'
	]
};

module.exports.command = message =>
	message.channel.createMessage('🍌');
