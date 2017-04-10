const config = require("./../../config.json");
const MSS = require("./../../functions/");
const Discord = require("discord.js");

module.exports = function(message) {
	if(message.author.id === config.MSS.sysadmin) {
		let input = message.content.replace (/\n/g, "").split(" ");
		input[0] = input[0].substring(config.MSS.prefix.length);
		let command = message.content.substring(config.MSS.prefix.length + input[0].length + 1);

		var embed = new Discord.RichEmbed()
			.addField("Input", "```js\n" + command + "\n```")
		try {
			let output = eval('(' + command + ')');
			embed.addField("Output", "```\n" + output + "\n```")
				.setColor("#00FF00");
			MSS.msg.react(message, true)
		} catch(err) {
			embed.addField("Error", "```\n" + err.stack + "\n```")
				.setColor("#FF0000");
			MSS.msg.react(message, false, "bomb");
		}

		message.channel.sendEmbed(embed, "", { disableEveryone: true });

	} else {
		MSS.msg.react(message, false, "x");
	}
}
