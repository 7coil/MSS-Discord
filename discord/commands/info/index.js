const Discord = require("discord.js");
const os = require('os');

//Non-changing statistics
//  (x64) AMD Athlon (x3) Something @ 3ghz (clocked at ????MHz)
var hardwareinfo = "[CPU] (" + os.arch() + ") " + os.cpus()[0]["model"] + " (clocked at " + os.cpus()[0]["speed"] + "MHz)";
var softwareinfo = "[" + os.type() + "] " + os.release() + "\n[Hostname] " + os.hostname();

module.exports = function(message) {

	//Realtime statistics
	var pinginfo = message.client.ping.toFixed(2) + "ms";
	var guildcount = message.client.guilds.size;

	var embed = new Discord.RichEmbed()
		.setFooter("MSS-Discord, " + message.client.mss.mss.version, "")
		.setTimestamp()
		.addField("MSS", message.client.mss.mss.version, true)
		.addField("Ping", pinginfo, true)
		.addField("Node.js", process.version, true)
		.addField("Uptime", timestamp(process.uptime()), true)
		.addField("Guilds", guildcount, true)
		.addField("PID", process.pid, true)
		.addField("Hardware", hardwareinfo)
		.addField("Software", softwareinfo)
		.addField("Licence", "This software is released under the MIT Licence.");


	message.channel.send("", { embed: embed, disableEveryone: true });
}

function timestamp(s) {
	var d, h, m;

	m = Math.floor(s / 60);
	s = s % 60;
	h = Math.floor(m / 60);
	m = m % 60;
	d = Math.floor(h / 24);
	h = h % 24;

	var message = "";
	if(d === 1) {
		message += d + " days "
	} else if (d > 1) {
		message += d + " day "
	};

	if(m === 1) {
		message += m + " minute "
	} else if (m > 1) {
		message += m + " minutes "
	};

	if(s === 1) {
		message += s + " second "
	} else if (s > 1) {
		message += s + " seconds "
	};

	return message || "Literally no time whatsoever";
}
