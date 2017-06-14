module.exports = (message) => {
	message.channel.send(`Ping! ${Math.floor(message.client.ping)}ms`);
};
