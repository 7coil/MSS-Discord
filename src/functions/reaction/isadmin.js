const config = require("./../../config.json");

module.exports = function isadmin(user, channel) {
	if (user.id === config.MSS.sysadmin || channel.permissionsFor(user).hasPermission("ADMINISTRATOR")) {
		return true;
	} else {
		return false;
	}
}
