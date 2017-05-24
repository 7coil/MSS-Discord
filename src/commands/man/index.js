const Discord = require("discord.js");
const MSS = require("./../../functions/");
const config = require("./../../config.json");
const fs = require("fs");
var commands = [];

//Construct the "full" list
fs.readdir("./commands/", function(err, items) {
	var print = "\n`@MSS man <command>`\n```\n";

	items.forEach(function(item) {
		var file = item.replace(/['"]+/g, "");
		commands[file] = require(`./../${file}/meta.json`);
	});

	print += items.join(`, `);
	print += "```";
});

module.exports = function manpages(message) {
	let input = message.content.replace(/\n/g, " ").split(" ");

	//Return the usage of the man command if no attributes were given
	if(!input[2]) {
		message.reply(`${meta[message.data.lang] && meta[message.data.lang].message_choose_man || "message_choose_man"} ${print}`);
		return false;
	}

	//Return if it doesn't exist
	if (!commands[input[2]]) {
		MSS.msg.react(message, false, "link");
		message.reply(`${meta[message.data.lang] && meta[message.data.lang].err_not_found || "err_not_found"} ${input[1]}`);
		return false;
	}

	var embed = new Discord.RichEmbed()
		.setTitle(commands[input[2]][message.data.lang].name)
		.setAuthor(meta[message.data.lang] && meta[message.data.lang].message_man_pages || "message_man_pages", "http://moustacheminer.com/img/mss.png")
		.setColor("#00AE86")
		.setDescription(commands[input[2]][message.data.lang].description)
		.setFooter("MSS-Discord, " + config.MSS.version, "")
		.setTimestamp()
		.setURL(commands[input[2]][message.data.lang].url);

	commands[input[2]][message.data.lang].examples.forEach(function(element) {
		embed.addField(input[2] + " " + element.var, element.description);
	});

	message.channel.send(input[2], { embed: embed, disableEveryone: true });
}

