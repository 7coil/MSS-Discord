const config = require("./../../config.json");
const Discord = require("discord.js");
const meta = require("./meta.json");

module.exports = function help(message) {
	var embed = new Discord.RichEmbed()
		.setFooter("MSS-Discord, " + config.MSS.version, "")
		.setTimestamp()
		.addField("MSS", config.MSS.version)
		.addField(data[message.data.lang] && data[message.data.lang].commands || "commands", data[message.data.lang] && data[message.data.lang].paragraph1 || "paragraph1")
		.addField(data[message.data.lang] && data[message.data.lang].links || "links", data[message.data.lang] && data[message.data.lang].paragraph2 || "paragraph2")
		.addField(data[message.data.lang] && data[message.data.lang].licence || "licence", data[message.data.lang] && data[message.data.lang].paragraph3 || "paragraph3");

	message.channel.send("", { embed: embed, disableEveryone: true });
}
