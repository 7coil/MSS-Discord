module.exports = (message) => {
	if (!message.guild) return message.channel.send('You are not in a guild!');
	const moderator = message.guild.members.filter(guildmember =>
		guildmember.presence.status === 'online' && !guildmember.user.bot && (guildmember.hasPermission(0x00000008) || guildmember.hasPermission(0x00000004) || guildmember.hasPermission(0x00000002))
	).random() || message.guild.owner;

	const report = message.content || 'No report provided :shrug:';

	return message.channel.createMessage(`Report by ${message.author} to ${moderator}:\n${report}`);
};
