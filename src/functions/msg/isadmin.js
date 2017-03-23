const config = require("./../../config.json");
const react = require("./react");

module.exports = function isadmin(message) {
	if (message.channel.permissionsFor(message.member).hasPermission("ADMINISTRATOR") || message.author.id === config.MSS.sysadmin) {
		return true;
	} else {
		react(message, false, "x");
		return false;
	}
}