const execFile = require('child_process').execFile;

module.exports.alias = [
	'cowsay',
	'moo',
	'cow'
];

module.exports.command = (message) => {
	const input = message.words[0] ? message.words : ['Have', 'you', 'mooed', 'today?'];

	return execFile('cowsay', input, (error, result) =>
		message.channel.createMessage(`\`\`\`\n${result}\n\`\`\``)
	);
};
