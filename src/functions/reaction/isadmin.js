const config = require("./../../config.json");

module.exports = function isadmin(input, channel) {
	if (input.channel.permissionsFor(input.member).hasPermission("ADMINISTRATOR") || input.author.id === config.MSS.sysadmin) {
		return true;
	} else {
		reactWith(message, false, "bomb");
		return false;
	}
}