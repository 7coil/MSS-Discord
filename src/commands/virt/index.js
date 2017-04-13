const exec = require('child_process').exec;
const command = "vncsnapshot 192.168.0.3:3 export.jpg";
const Discord = require("discord.js");
const xml2js = require('xml2js');

module.exports = function screenshot(message) {
	exec(command, function(error, stdout, stderr) {
		input = {
			response: {
				name: meta.meta.name,
				to: message.author.username,
				error: false,
				output: {
					details: "Break the Virtual Machine!",
					url: "http://vnc.moustacheminer.com/"
				}
			}
		}

		var builder = new xml2js.Builder();

		var reply = "```xml\n";
		reply += builder.buildObject(input);
		reply += "\n```"

		message.channel.sendFile('./export.jpg', '.jpg', reply);
	});
}
