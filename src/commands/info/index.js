const Discord = require("discord.js");
const config = require("./../../config.json");
const meta = require("./meta.json");
const os = require('os');

module.exports = function(message) {

	//Realtime statistics
	var pinginfo = message.client.ping.toFixed(2) + "ms";
	var guildcount = message.client.guilds.size;
	var hardwareinfo = "[CPU] (" + os.arch() + ") " + os.cpus()[0]["model"] + " (" + os.cpus()[0]["speed"] + "MHz)";
	var softwareinfo = `[${os.type()}] ${os.release()}\n[${meta[message.data.lang] && meta[message.data.lang].hostname || "hostname"}] ${os.hostname()}`;

	var embed = new Discord.RichEmbed()
		.setFooter("MSS-Discord, " + config.MSS.version, "")
		.setTimestamp()
		.addField("MSS", config.MSS.version, true)
		.addField(meta[message.data.lang] && meta[message.data.lang].ping || "ping", pinginfo, true)
		.addField("Node.js", process.version, true)
		.addField(meta[message.data.lang] && meta[message.data.lang].uptime || "uptime", process.uptime(), true)
		.addField(meta[message.data.lang] && meta[message.data.lang].guilds || "guilds", guildcount, true)
		.addField("PID", process.pid, true)
		.addField(meta[message.data.lang] && meta[message.data.lang].hardware || "hardware", hardwareinfo)
		.addField(meta[message.data.lang] && meta[message.data.lang].software || "software", softwareinfo)

	if(config.MSS.shards) {
		embed.addField(meta[message.data.lang] && meta[message.data.lang].shard || "shard", message.client.shard.id, true)
			.addField(meta[message.data.lang] && meta[message.data.lang].shards || "shards", config.MSS.shards, true)
			.addField(meta[message.data.lang] && meta[message.data.lang].ratio || "ratio", (message.client.guilds.size / config.MSS.shards).toFixed(2), true);
	}

	message.channel.send("", { embed: embed, disableEveryone: true });
}
