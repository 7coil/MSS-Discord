const config = require('config');

module.exports = function screenshot(message) {
	if(config.get("admins").includes(message.author.id)) {
		message.channel.send("`Restarting shard...`")
			.then( function() {
				process.exit(0);
			});
	}
}
