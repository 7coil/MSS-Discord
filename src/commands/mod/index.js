const exec = require('child_process').exec;
const command = "vncsnapshot 192.168.0.3:6 screenshot.jpg";

module.exports = function(message) {
	if (!message.guild) return message.channel.send("You are not in a guild!");
	let moderator = message.guild.members.filter((user)=>{
		return (user.hasPermission(0x00000008) || user.hasPermission(0x00000004) || user.hasPermission(0x00000002)) && user.presence.status === "online" && !user.bot
	}).random().id || message.guild.ownerID;
	message.words.shift();
	message.words.shift();
	let report = message.words.join(" ") || "No report provided :shrug:";

	if(message.guild.id === "110373943822540800" /*&& message.channel.id === "110373943822540800"*/) {
		return exec(command, function(error, stdout, stderr) {
			message.channel.send(`Report by <@${message.author.id}> to ${moderator}:\n${report}\nAuto Screenshot:`, {
				files: [
					"./screenshot.jpg"
				]
			});
		});
	}

	message.channel.send(`Report by <@${message.author.id}> to ${moderator}:\n${report}`);
}
