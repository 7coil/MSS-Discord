const config = require("./../../config.json");

module.exports = function isadmin(user, channel) {
	if (channel.permissionsFor(user).hasPermission("ADMINISTRATOR") || user.id === config.MSS.sysadmin) {
		return true;
	} else {
		return false;
	}
}
