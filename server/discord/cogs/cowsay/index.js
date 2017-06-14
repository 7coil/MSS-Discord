const execFile = require('child_process').execFile;

module.exports = function screenshot(message) {
	if (message.content) message.words = ('Have you mooed today?').split(' ');

	execFile('cowsay', message.words, (error, result) =>
		message.channel.send(`\`\`\`\n${result}\n\`\`\``)
	);
};
