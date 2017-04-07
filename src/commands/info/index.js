const Discord = require("discord.js");
const config = require("./../../config.json");
const os = require('os');

//  (x64) AMD Athlon (x3) Something @ 3ghz (clocked at ????MHz)
var hardwareinfo = "[CPU] (" + os.arch() + ") " + os.cpus()[0]["model"] + " (clocked at " + os.cpus()[0]["speed"] + "MHz)";
var softwareinfo = "[" + os.type() + "] " + os.release() + "\n[Hostname] " + os.hostname();

module.exports = function(message, client) {
	var pinginfo = client.ping + "ms";
	var shardinfo;
	if(!client.shard) {
		shardinfo = "The bot is not running in shard mode.";
	} else {
		shardinfo = client.shard.id;
	}

	var embed = new Discord.RichEmbed()
		.setFooter("MSS-Discord, " + config.MSS.version, "")
		.setTimestamp()
		.setURL("http://moustacheminer.com/")
		.addField("Average Ping", pinginfo)
		.addField("Shard ID", shardinfo, true)
		.addField("Hardware", hardwareinfo, true)
		.addField("Software", softwareinfo, true);

	message.channel.sendEmbed(embed, "", { disableEveryone: true });
}
