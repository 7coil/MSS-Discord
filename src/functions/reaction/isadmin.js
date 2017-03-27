const config = require("./../../config.json");
const react = require("./../msg/react");

module.exports = function isadmin(user, channel) {
	if (channel.permissionsFor(user).hasPermission("ADMINISTRATOR") || user.id === config.MSS.sysadmin) {
		return true;
	} else {
		react(message, false, "x");
		return false;
	}
}
