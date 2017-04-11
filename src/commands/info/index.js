const Discord = require("discord.js");
const config = require("./../../config.json");
const os = require('os');

//  (x64) AMD Athlon (x3) Something @ 3ghz (clocked at ????MHz)
var hardwareinfo = "[CPU] (" + os.arch() + ") " + os.cpus()[0]["model"] + " (clocked at " + os.cpus()[0]["speed"] + "MHz)";
var softwareinfo = "[" + os.type() + "] " + os.release() + "\n[Hostname] " + os.hostname();

module.exports = function(message) {
	var pinginfo = message.client.ping + "ms";

	var guildcount = message.client.guilds.size;
	var shardcount = config.MSS.shards;
	var shardguildratio = (message.client.guilds.size / config.MSS.shards).toFixed(2);
	var shardinfo = message.client.shard.id;

	var embed = new Discord.RichEmbed()
		.setFooter("MSS-Discord, " + config.MSS.version, "")
		.setTimestamp()
		.addField("MSS", config.MSS.version, true)
		.addField("Ping", pinginfo, true)
		.addField("Node.js", process.version, true)
		.addField("Uptime", process.uptime(), true)
		.addField("Shard", shardinfo, true)
		.addField("PID", process.pid, true)
		.addField("Hardware", hardwareinfo)
		.addField("Software", softwareinfo)
		.addField("Licence", "This software is released under the MIT Licence.");

	var shardinfo;
	if(shardcount) {
		embed.addField("Guilds", guildcount, true)
			.addField("Shards", shardcount, true)
			.addField("Shard/Guild Ratio", shardguildratio, true);
	}

	message.channel.sendEmbed(embed, "", { disableEveryone: true });
}
