module.exports = (message) => {
	message.channel.createMessage(`Ping! ${Math.floor(message.client.ping)}ms`);
};
