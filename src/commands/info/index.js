const Discord = require("discord.js");
const config = require("./../../config.json");
const os = require('os');
const meta = require("./meta.json");
const MSS = require("./../../functions/");

module.exports = function(message) {
	var reply = [];

	//Realtime statistics
	var pinginfo = message.client.ping + "ms";
	var guildcount = message.client.guilds.size;

	reply = {
		response: {
			name: meta.meta.name,
			to: message.author.username,
			error: false,
			output: {
				xml: config.MSS.version,
				ping: pinginfo,
				node: process.version,
				uptime: process.uptime(),
				guilds: guildcount,
				pid: process.pid,
				hardware: {
					arch: os.arch(),
					model: os.cpus()[0]["model"],
					clock: os.cpus()[0]["speed"] + "MHz"
				},
				software: {
					type: os.type(),
					release: os.release(),
					hostname: os.hostname()
				}
			}
		}
	}

	MSS.msg.xml(message, reply);
}
