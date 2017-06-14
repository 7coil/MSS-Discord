module.exports = (message) => {
	if (message.content) message.client.mss.functions.music.add(message, 'http', message.content, 'Custom URL', 'https://i.mss.ovh/cloud.png');
};
