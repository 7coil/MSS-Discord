const exec = require('child_process').exec;
const command = "vncsnapshot 192.168.0.3:6 screenshot.jpg";

module.exports = function(message) {
	if (!message.guild) return message.channel.send("You are not in a guild!");
	let moderator = message.guild.members.filter((guildmember)=>{
		return (guildmember.presence.status === "online" && !guildmember.user.bot && (guildmember.hasPermission(0x00000008) || guildmember.hasPermission(0x00000004) || guildmember.hasPermission(0x00000002)));
	}).random() || message.guild.owner;

	let report = message.content || "No report provided :shrug:";

	if(message.guild.id === "110373943822540800" && message.channel.id === "110373943822540800" && message.words && message.words[0] === "shot") {
		return exec(command, function(error, stdout, stderr) {
			message.channel.send(`Report by ${message.author} to ${moderator}:\n${report}\nAuto Screenshot:`, {
				files: [
					"./screenshot.jpg"
				]
			});
		});
	}

	message.channel.send(`Report by ${message.author} to ${moderator}:\n${report}`);
}
