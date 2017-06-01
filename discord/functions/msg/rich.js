const config = require("./../../config/config.json");
const Discord = require("discord.js");

module.exports = function(message, subheading, description, colour) {

	var embed = new Discord.RichEmbed()
		.setTitle(subheading)
		.setAuthor("MSS", "http://moustacheminer.com/mss.png")
		.setColor(colour)
		.setDescription(description)
		.setFooter("MSS-Discord, " + config.MSS.version, "")
		.setTimestamp()
		.setURL("http://moustacheminer.com/r/invite-server");

	message.channel.send("", { embed: embed, disableEveryone: true });
}