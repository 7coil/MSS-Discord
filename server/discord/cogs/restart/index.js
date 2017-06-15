const config = require('config');

module.exports = (message) => {
	if (config.get('admins').includes(message.author.id)) {
		message.channel.createMessage('Restarting...')
			.then(() =>
				process.exit(0)
			);
	}
};
