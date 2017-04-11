const Discord = require("discord.js");
const config = require("./../../config.json");
const os = require('os');
const meta = require("./meta.json");
const MSS = require("./../../functions/");

//Non-changing statistics
//  (x64) AMD Athlon (x3) Something @ 3ghz (clocked at ????MHz)
var hardwareinfo = "[CPU] (" + os.arch() + ") " + os.cpus()[0]["model"] + " (clocked at " + os.cpus()[0]["speed"] + "MHz)";
var softwareinfo = "[" + os.type() + "] " + os.release() + "\n[Hostname] " + os.hostname();

module.exports = function(message) {
	var reply = [];

	//Realtime statistics
	var pinginfo = message.client.ping + "ms";
	var guildcount = message.client.guilds.size;
	var shardcount = config.MSS.shards;
	var shardguildratio = (message.client.guilds.size / config.MSS.shards).toFixed(2);
	var shardinfo = message.client.shard.id;

	reply.push("MSS: " + config.MSS.version);
	reply.push("Ping: " + pinginfo);
	reply.push("Node.js: " + process.version);
	reply.push("Uptime: " + process.uptime());
	reply.push("Guilds: " + guildcount);
	reply.push("PID: " + process.pid);
	reply.push("Hardware: " + hardwareinfo);
	reply.push("Software: " + softwareinfo);
	reply.push("Licence: This software is released under the MIT Licence.");

	if(shardcount) {
		reply.push("Shard: " + shardinfo);
		reply.push("Shards: " + shardcount);
		reply.push("Shard/Guild Ratio: " + shardguildratio);
	}

	MSS.msg.xml(message, meta, reply);
}
