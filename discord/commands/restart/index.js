module.exports = function screenshot(message) {
	if(message.author.id === message.client.mss.config.sysadmin) {
		message.channel.send("`Restarting shard...`")
			.then( function() {
				process.exit(0);
			});
	}
}
