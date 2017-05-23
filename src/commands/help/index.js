const config = require("./../../config.json");
const Discord = require("discord.js");
const meta = require("./meta.json");

module.exports = function help(message) {
	var embed = new Discord.RichEmbed()
		.setFooter("MSS-Discord, " + config.MSS.version, "")
		.setTimestamp()
		.addField("MSS", config.MSS.version)
		.addField(meta[message.data.lang] && meta[message.data.lang].commands || "commands",	meta[message.data.lang] && meta[message.data.lang].paragraph1 || "paragraph1")
		.addField(meta[message.data.lang] && meta[message.data.lang].links || "links",			meta[message.data.lang] && meta[message.data.lang].paragraph2 || "paragraph2")
		.addField(meta[message.data.lang] && meta[message.data.lang].licence || "licence",		meta[message.data.lang] && meta[message.data.lang].paragraph3 || "paragraph3");

	message.channel.send("", { embed: embed, disableEveryone: true });
}
