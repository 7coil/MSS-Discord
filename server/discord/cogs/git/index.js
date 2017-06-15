const execFile = require('child_process').execFile;
const config = require('config');

module.exports.alias = [
	'git',
	'github',
	'bitbucket',
	'gitlab'
];

module.exports.command = (message) => {
	if (config.get('admins').includes(message.author.id)) {
		execFile('git', message.words, (error, result) => {
			message.channel.createMessage(`\`\`\`${result}\`\`\``);
		});
	}
};
