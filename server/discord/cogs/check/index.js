module.exports.alias = [
	'check',
	'ping'
];

module.exports.command = message =>
	message.channel.createMessage('Discord is currently `OFFLINE` and not working. Try using Skype while waiting for Discord to come back online?');
