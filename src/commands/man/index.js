const Discord = require("discord.js");
const MSS = require("./../../functions/");
const config = require("./../../config.json");
const fs = require("fs");
var commands = [];
var print = "What manual page do you want?\n" + config.MSS.prefix + "man <command>\n" + config.MSS.prefix + "man all\n";

//Get all .json files in this directory to read the man data.
fs.readdir("./commands/", function(err, items) {
	items.forEach(function(item) {
		var file = item.replace(/['"]+/g, "");
		print += "> " + file + "\n";
		//Include the meta.json files in the commands directory
		commands[file] = require("./../" + file + "/meta.json");
	});
});

module.exports = function manpages(message) {
	let input = message.content.replace(/\n/g, " ").split(" ");

	//Return the usage of the man command if no attributes were given
	if(!input[1]) {
		message.reply(print);
		return false;
	}

	//Return an entire list of commands via DM
	if(input[1] === "all") {
		message.reply("I sent a message via Direct Messaging with details enclosed.");
		console.dir(commands);

		commands.forEach(function(item, index) {
			console.dir(item);
			console.log(index);
			var embed = new Discord.RichEmbed()
				.setTitle(item.meta.name)
				.setAuthor("MSS Man Pages", "http://moustacheminer.com/mss.png")
				.setColor("#00AE86")
				.setDescription(item.meta.description)
				.setFooter("MSS-Discord, " + config.MSS.version, "")
				.setTimestamp()
				.setURL(item.meta.url);

			item.meta.examples.forEach(function(element) {
				embed.addField(config.MSS.prefix + index + " " + element.var, element.description);
			});

			message.author.sendEmbed(embed, "" , { disableEveryone: true });

			console.log(index);
		});

		return false;
	}

	//Return if it doesn't exist
	if (!commands[input[1]]) {
		MSS.msg.react(message, false, "link");
		message.reply("No manual entry for " + input[1]);
		return false;
	}

	var embed = new Discord.RichEmbed()
		.setTitle(commands[input[1]].meta.name)
		.setAuthor("MSS Man Pages", "http://moustacheminer.com/mss.png")
		.setColor("#00AE86")
		.setDescription(commands[input[1]].meta.description)
		.setFooter("MSS-Discord, " + config.MSS.version, "")
		.setTimestamp()
		.setURL(commands[input[1]].meta.url);

	commands[input[1]].meta.examples.forEach(function(element) {
		embed.addField(config.MSS.prefix + input[1] + " " + element.var, element.description);
	});

	message.channel.sendEmbed(embed, input[1], { disableEveryone: true });
}

