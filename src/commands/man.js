const MSS = require("./../functions/");
const config = require("./../config.json");
const fs = require("fs");
var commands = [];

//Get all .json files in this directory to read the man data.
fs.readdir("./", function(err, items) {
	items.forEach(function(item) {
		var file = item.replace(/['"]+/g, "");
		if (file.endsWith(".json")) {
			commands[file] = require("./" + file);
		}
	});
});

module.exports = function manpages(message) {
	let input = message.content.replace (/\n/g, "").split(" ");

	//Return if it doesn't exist
	if (!command[input[1]]) {
		MSS.msg.react(message, false, "link");
		message.reply("The command either does not exist, or does not have a .json metadata file.");
		return false;
	}

	var embed = new Discord.RichEmbed()
		.setTitle(command[input[1]].meta.name)
		.setAuthor("MSS Man Pages", "http://moustacheminer.com/mss.png")
		.setColor("#00AE86")
		.setDescription(command[input[1]].meta.description)
		.setFooter("MSS-Discord, " + config.MSS.version, "")
		.setTimestamp()
		.setURL(command[input[1]].meta.url);

	command[input[1]].meta.examples.forEach(function(element) {
		embed.addField(input[1] + " " + element.var, element.description);
	});

	message.channel.sendEmbed(embed, 'MSS-Discord Manual', { disableEveryone: true });
}
