module.exports.info = {
	name: '🍌',
	category: 'random',
	aliases: [
		'🍌',
		'banana',
		':banana:'
	]
};

module.exports.command = message =>
	message.channel.createMessage('🍌');
