const Discord = require("discord.js");

module.exports = function help(message) {

	if (message.content) {
		if(message.client.mss.man[message.content]) {
			message.channel.send(message.content, message.client.mss.man[message.content]);
		} else {
			message.channel.send("Error 404 - Help not found!");
		}
	} else {
		let embed = {
			"embed": {
				"title": `MSS-Discord ${message.client.mss.mss.version}`,
				"fields": [
					{
						"name": "Commands",
						"value": "For help on a specific command, please run `@MSS help <command>`\n```\n" + Object.keys(message.client.mss.man).join(", ") + "\n```"
					},{
						"name": "Prefixes",
						"value": message.client.mss.config.prefix.join(" OR ")
					},{
						"name": "Links",
						"value": "[Discord Server](http://moustacheminer.com/r/invite-server)\n[Invite Bot](http://moustacheminer.com/r/invite-bot)\n[GitHub](http://moustacheminer.com/r/github-bot)"
					},{
						"name": "Licence",
						"value": "This copy of MSS-Discord is licenced under the MIT Licence"
					}
				]
			}
		}

		message.channel.send("_", embed);
	}

}
