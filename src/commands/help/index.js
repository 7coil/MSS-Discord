const config = require("./../../config.json");

module.exports = function help(message) {
	var embed = new Discord.RichEmbed()
		.setFooter("MSS-Discord, " + config.MSS.version, "")
		.setTimestamp()
		.addField("MSS", config.MSS.version)
		.addField("Commands", "For a list of commands, please run the '" + config.MSS.prefix + "man' command.\nFor help on a specific command, please run '" + config.MSS.prefix + "man <command>'.")
		.addField("Links", "[Discord Server](http://moustacheminer.com/r/invite-server)\n[Invite Bot](http://moustacheminer.com/r/invite-bot)\n[GitHub](http://moustacheminer.com/r/github-bot)")
		.addField("Licence", "This software is released under the MIT Licence.");

	message.channel.sendEmbed(embed, "", { disableEveryone: true });
}
