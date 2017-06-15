const data = require('./data.json');

module.exports.alias = [
	'proverb',
	'random proverb'
];

module.exports.command = message =>
	message.channel.createMessage(data.data[Math.floor(Math.random() * data.data.length)]);
