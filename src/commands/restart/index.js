const config = require("./../../config.json");

module.exports = function screenshot(message) {
	if(message.author.id === config.MSS.sysadmin) {
		message.channel.sendMessage("`Restarting shard...`")
			.then( function() {
				process.exit(0);
			});
	}
}
