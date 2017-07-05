const data = require('./data.json');

module.exports.info = {
	name: 'Fortune Cookie',
	category: 'random',
	aliases: [
		'cookie'
	]
};

module.exports.command = message =>
	message.channel.createMessage(data.data[Math.floor(Math.random() * data.data.length)]);
