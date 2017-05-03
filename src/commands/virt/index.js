const exec = require('child_process').exec;
const command = "vncsnapshot 192.168.0.3:3 export.jpg";
const Discord = require("discord.js");

module.exports = function screenshot(message) {
	exec(command, function(error, stdout, stderr) {
		 message.channel.sendFile('./export.jpg', '.jpg', "Break the Virtual Machine! - http://mss.ovh/vm");
	});
}
