const config = require("./../../config.json");
const MSS = require("./../../functions/");
const Discord = require("discord.js");

module.exports = function(message) {
	if(message.author.id === config.MSS.sysadmin) {
		let input = message.content.replace (/\n/g, "").split(" ");
        input.shift();
		input.shift();
		let command = input.join(" ");

		var embed = new Discord.RichEmbed()
			.addField("Input", "```js\n" + command + "\n```")

		try {
			let output = eval('(' + command + ')');
			if(output && output.length > 1000) {
				embed.addField("Output", "```\nUploading output to GitHub\n```")
					.setColor("#00FF00");
				MSS.system.gist(message, output);
			} else {
				embed.addField("Output", "```\n" + output + "\n```")
					.setColor("#00FF00");
			}

			MSS.msg.react(message, true)
		} catch(err) {
			if(err.stack && err.stack.length > 1000) {
				embed.addField("Error", "```\nUploading error to GitHub\n```")
					.setColor("#FF0000");
				MSS.system.gist(message, err.stack);
			} else {
				embed.addField("Error", "```\n" + err.stack + "\n```")
					.setColor("#FF0000");
			}
			MSS.msg.react(message, false, "bomb");
		}

		message.channel.send("", { embed: embed, disableEveryone: true });

	} else {
		MSS.msg.react(message, false, "x");
	}
}
