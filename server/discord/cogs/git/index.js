const execFile = require('child_process').execFile;
const config = require('config');

module.exports = (message) => {
	if (config.get('admins').includes(message.author.id)) {
		execFile('git', message.words, (error, result) => {
			message.channel.send(`\`\`\`${result}\`\`\``);
		});
	}
};
