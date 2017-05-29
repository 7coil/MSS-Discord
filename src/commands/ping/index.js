module.exports = function(message) {
	message.channel.send(`${message.client.ping.floor()}ms`);
}
