module.exports = function(message) {
	message.channel.send(`Pong! ${Math.floor(message.client.ping)}ms`);
}
