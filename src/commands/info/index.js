const Discord = require("discord.js");
const config = require("./../../config.json");

module.exports = function(message, client) {
	var embed = new Discord.RichEmbed()
		.setTitle("MSS-Discord")
		.setAuthor("Bot Data", "http://moustacheminer.com/mss.png")
		.setColor("#00AE86")
		.setDescription("Here is some info.")
		.setFooter("MSS-Discord, " + config.MSS.version, "")
		.setTimestamp()
		.setURL("http://moustacheminer.com/")
		.addField("Average Ping", client.ping)
		.addField("Last three pings", client.pings)
		.addField("Shard ID", client.shard.id);

	message.author.sendEmbed(embed, "", { disableEveryone: true });
}
