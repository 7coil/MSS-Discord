const data = require('./data.json');

module.exports.info = {
	name: 'Magic 8 Ball',
	category: 'Random',
	aliases: [
		'8',
		'8-ball'
	]
};

module.exports.command = message =>
	message.channel.createMessage(data.data[Math.floor(Math.random() * data.data.length)]);
