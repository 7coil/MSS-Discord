module.exports = function(message) {
	message.channel.send(`${Math.floor(message.client.ping)}ms`);
}
