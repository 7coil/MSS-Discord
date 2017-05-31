module.exports = function(message) {
	if (!message.guild) return message.channel.send("You are not in a guild!");
	let moderator = message.guild.members.filter((user)=>{return user.hasPermission(0x00000008) && user.presence.status === "online"}).random().id || message.guild.ownerID;
	message.words.shift();
	message.words.shift();
	let report = message.words.join(" ") || "No report provided :shrug:";
	message.channel.send(`Report by <@${message.author.id}> to ${moderator}:\n${report}`);
}
