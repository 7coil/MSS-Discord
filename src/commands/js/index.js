const config = require("./../../config.json");
const MSS = require("./../../functions/");
const Sandbox = require("sandbox");
const Discord = require("discord.js");

module.exports = function(message) {
	return message.reply("This function has been disabled in software.");
	var s = new Sandbox;

	let input = message.content.replace (/\n/g, " ").split(" ");
	try {
		let command = message.content.substring(input[0].length + 1);
		console.log(command);
		if (!command) return message.reply("No code was supplied.");

		s.run(command, function(output) {
			var consoleout = output.console.length === 0 ? ["No output"] : output.console;

			var embed = new Discord.RichEmbed()
				.setTitle("MSS-Discord JS Sandbox")
				.setAuthor("js", "http://moustacheminer.com/mss.png")
				.setColor("#00AE86")
				.setDescription(command)
				.setFooter("MSS-Discord, " + config.MSS.version, "")
				.setTimestamp()
				.setURL("http://moustacheminer.com/")
				.addField("Result", output.result)
				.addField("Console", consoleout);

			console.log(output.result);
			console.log(consoleout);

			message.channel.sendEmbed(embed, 'MSS-Discord JS Sandbox', { disableEveryone: true });
		});

	} catch(err) {
		message.reply("Something happened and an ACTUAL ERROR happened outside the sandbox.");
	}
}

