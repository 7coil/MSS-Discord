const data = require('./data.json');

module.exports.alias = [
	'8',
	'8-ball',
	'random 8'
];

module.exports.command = message =>
	message.channel.createMessage(data.data[Math.floor(Math.random() * data.data.length)]);
