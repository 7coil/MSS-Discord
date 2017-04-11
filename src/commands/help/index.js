const config = require("./../../config.json");
const Discord = require("discord.js");

module.exports = function help(message) {
	reply = ["For a list of commands, run man, with option of 'all'.", "For help on a specific command, run man, with the option of your choice.", "This version of MSS-Discord (XML-Discord ) is by 7coil, at moustacheminer.com", "This software is released under the MIT Licence"];

	MSS.msg.xml(message, meta, reply);
}
