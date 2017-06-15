const data = require('./data.json');

module.exports = message =>
	message.channel.createMessage(data.data[Math.floor(Math.random() * data.data.length)]);
