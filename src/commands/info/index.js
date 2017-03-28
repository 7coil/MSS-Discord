const Discord = require("discord.js");
const config = require("./../../config.json");
const os = require('os');

//  (x64) AMD Athlon (x3) Something @ 3ghz (clocked at ????MHz)
var hardwareinfo = "[CPU] (" + os.arch() + ") " + os.cpus()[0]["model"] + " (clocked at " + os.cpus()[0]["speed"] + "MHz)";
var softwareinfo = "[" + os.type() + "] " + os.release() + "\n[Hostname] " + os.hostname();

module.exports = function(message, client) {
	var pinginfo = client.ping + "ms";
	var shardinfo = client.shard.id;

	var embed = new Discord.RichEmbed()
		.setTitle("MSS-Discord")
		.setAuthor("Bot Data", "http://moustacheminer.com/mss.png")
		.setColor("#00AE86")
		.setDescription("Dont know why you need this, but ok.")
		.setFooter("MSS-Discord, " + config.MSS.version, "")
		.setTimestamp()
		.setURL("http://moustacheminer.com/")
		.addField("Average Ping", pinginfo)
		.addField("Shard ID", shardinfo)
		.addField("Hardware", hardwareinfo)
		.addField("Software", softwareinfo);

	message.channel.sendEmbed(embed, "", { disableEveryone: true });
}
