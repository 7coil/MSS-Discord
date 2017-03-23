const config = require("./../../config.json");

module.exports = function isadmin(message) {
	if (message.channel.permissionsFor(input.member).hasPermission("ADMINISTRATOR") || message.author.id === config.MSS.sysadmin) {
		return true;
	} else {
		reactWith(message, false, "bomb");
		return false;
	}
}