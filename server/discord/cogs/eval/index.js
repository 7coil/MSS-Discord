const config = require('config');

module.exports = (message) => {
	if (config.get('admins').includes(message.author.id)) {
		try {
			eval(message.content); // eslint-disable-line no-eval
		} catch (err) {
			message.channel.createMessage(`\`\`\`${err.stack}\`\`\``);
		}
	}
};

