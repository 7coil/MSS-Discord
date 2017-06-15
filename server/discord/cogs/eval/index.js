const config = require('config');

module.exports.alias = [
	'eval',
	'evaluate'
];

module.exports.command = (message) => {
	if (config.get('admins').includes(message.author.id)) {
		try {
			eval(message.content); // eslint-disable-line no-eval
		} catch (err) {
			message.channel.createMessage(`\`\`\`${err.stack}\`\`\``);
		}
	}
};

