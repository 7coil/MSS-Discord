const config = require("./../../config.json");
const Discord = require("discord.js");

module.exports = function(message, subheading, description, colour) {

	var embed = new Discord.RichEmbed()
		.setTitle(subheading)
		.setAuthor("MSS", "http://moustacheminer.com/dickbutt.jpg")
		.setColor(colour)
		.setDescription(description)
		.setFooter("moustacheminer.com server services, version " + config.MSS.version, "")
		.setTimestamp()

	message.channel.sendEmbed(embed, "", { disableEveryone: true });
}
