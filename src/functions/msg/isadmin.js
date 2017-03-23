const config = require("./../../config.json");
const rich = require("./rich");

module.exports = function isadmin(message) {
	if (message.channel.permissionsFor(message.member).hasPermission("ADMINISTRATOR") || message.author.id === config.MSS.sysadmin) {
		return true;
	} else {
		rich(message, false, "bomb");
		return false;
	}
}