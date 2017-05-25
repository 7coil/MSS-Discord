const config = require("./../../config.json");

module.exports = function isadmin(message) {
	if (message.author.id === config.MSS.sysadmin || message.channel.permissionsFor(message.member).hasPermission("ADMINISTRATOR")) {
		return true;
	} else {
		return false;
	}
}
