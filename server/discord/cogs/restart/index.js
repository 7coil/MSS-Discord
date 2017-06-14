const config = require('config');

module.exports = (message) => {
	if (config.get('admins').includes(message.author.id)) {
		message.channel.send('Restarting shard...')
			.then(() =>
				process.exit(0)
			);
	}
};
