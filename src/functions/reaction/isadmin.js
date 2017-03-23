const config = require("./../../config.json");
const rich = require("./../msg/rich");

module.exports = function isadmin(user, channel) {
	if (channel.permissionsFor(user).hasPermission("ADMINISTRATOR") || user.id === config.MSS.sysadmin) {
		return true;
	} else {
		reactWith(message, false, "x");
		return false;
	}
}