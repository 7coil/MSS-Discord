const exec = require('child_process').exec;
const command = "vncsnapshot 192.168.0.37:0 export.jpg";
const Discord = require("discord.js");

module.exports = function screenshot(message) {
	exec(command, function(error, stdout, stderr) {
		message.channel.send("Discord Plays! http://mss.ovh/dp", {file: "./export.jpg"});
	});
}
