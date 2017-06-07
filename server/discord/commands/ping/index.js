module.exports = function(message) {
	message.channel.send(`Ping! ${Math.floor(message.client.ping)}ms`);
}
