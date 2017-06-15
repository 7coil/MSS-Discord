const data = require('./data.json');

module.exports.alias = [
	'cookie',
	'fortune',
	'random cookie'
];

module.exports.command = message =>
	message.channel.createMessage(data.data[Math.floor(Math.random() * data.data.length)]);
