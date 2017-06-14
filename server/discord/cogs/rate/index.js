const crypto = require('crypto');

module.exports = function screenshot(message) {
	if (message.input.length > 100) message.input = `${message.input.substring(0, 100)}...`;
	const rank = parseInt(crypto.createHash('md5').update(message.content.toLowerCase()).digest('hex'), 16) % 11;
	message.channel.send(`I rate ${message.content} a ${rank} out of 11`);
};
