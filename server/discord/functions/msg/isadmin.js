const config = require('config');
const react = require("./react");

module.exports = function isadmin(message) {
	if ((message.guild && message.channel.permissionsFor(message.member).hasPermission("ADMINISTRATOR")) || config.get("admins").includes(message.author.id)) {
		return true;
	} else {
		react(message, false, "x");
		return false;
	}
}
