const Discord = require("discord.js");
const MSS = require("./../functions/");
const config = require("./../config.json");
const fs = require("fs");
var commands = [];

//Get all .json files in this directory to read the man data.
fs.readdir("./commands/", function(err, items) {
	items.forEach(function(item) {
		var file = item.replace(/['"]+/g, "");
		if (file.endsWith(".json")) {
			file = file.replace(".json", "");
			commands[file] = require("./" + file + ".json");
		}
	});
});

module.exports = function manpages(message) {
	let input = message.content.replace (/\n/g, "").split(" ");

	//Return the usage of the man command if no attributes were given
	if(!input[1]) {
		var print = "Listing all valid commands - See info for commands by running " + config.MSS.prefix + "man <command>\n";
		commands.forEach(function(element) {
			print.concat(" - " + element.meta.name + "\n");
		});
		message.reply(print);
		return false;
	}

	//Return if it doesn't exist
	if (!commands[input[1]]) {
		MSS.msg.react(message, false, "link");
		message.reply("The command either does not exist, or does not have a .json metadata file.");
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

	message.channel.sendEmbed(embed, 'MSS-Discord Manual', { disableEveryone: true });
}
