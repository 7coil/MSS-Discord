const config = require('config');

module.exports.info = {
	name: 'Restart',
	category: 'development',
	aliases: [
		'restart',
		'reboot'
	]
};

module.exports.command = (message) => {
	if (config.get('admins').includes(message.author.id)) {
		message.channel.createMessage('Restarting...')
		//	.then(() =>
		//		process.exit(0)
		//	);
	}
};
