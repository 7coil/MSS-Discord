const Discord = require("discord.js");
const config = require('config');

module.exports = function(message) {
	if(config.get("admins").includes(message.author.id)) {

		var embed = new Discord.RichEmbed()
			.addField("Input", "```js\n" + message.content + "\n```")

		try {
			let output = eval('(' + message.content + ')');
			if(output.length > 1000) output = output.substring(0, 1000) + "...";
			embed.addField("Output", "```\n" + output + "\n```")
				.setColor("#00FF00");
			message.client.mss.functions.msg.react(message, true)
		} catch(err) {
			if(err.stack.length > 1000) {
				embed.addField("Error", "```\nThe command ended so spectacularly, that the stack was too long to display. Consult the console for more details.\n```")
					.setColor("#FF0000");
				console.log(err.stack);
			} else {
				embed.addField("Error", "```\n" + err.stack + "\n```")
					.setColor("#FF0000");
			}
			message.client.mss.functions.msg.react(message, false, "bomb");
		}

		message.channel.send("", { embed: embed, disableEveryone: true });

	} else {
		message.client.mss.functions.msg.react(message, false, "x");
	}
}
