const config = require('config');

module.exports.info = {
	name: 'JavaScript Evaluation',
	category: 'development',
	aliases: [
		'eval'
	]
};

module.exports.command = (message) => {
	if (config.get('admins').includes(message.author.id)) {
		try {
			eval(message.input); // eslint-disable-line no-eval
		} catch (err) {
			message.channel.createMessage(`\`\`\`${err.stack}\`\`\``);
		}
	}
};

