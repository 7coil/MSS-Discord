const exec = require('child_process').exec;
const command = "vncsnapshot 192.168.0.3:5 export.jpg";
const Discord = require("discord.js");

module.exports = function screenshot(message) {
	exec(command, (error, stdout, stderr) {
		 message.sendFile('./export.jpg', '.jpg', stdout);
	});
}
