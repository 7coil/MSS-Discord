const exec = require('child_process').exec;
const config = require('config');

module.exports.alias = [
	'exec',
	'execute'
];

module.exports.command = (message) => {
	if (config.get('admins').includes(message.author.id)) {
		if (!message.input) {
			message.channel.send('No input detected');
		} else {
			exec(message.input, (error, stdout, stderr) => {
				let output = '';

				if (stdout) {
					output += '=== stdout ===\n';
					output += `${stdout.replace(/`/g, '\'')}\n`;
				}

				if (stderr) {
					output += '=== stderr ===\n';
					output += `${stderr.replace(/`/g, '\'')}\n`;
				}

				if (output && output.length > 1900) {
					message.client.mss.functions.system.gist(message, (url) => {
						message.channel.createMessage(`[GitHub](${url})`);
					});
				} else {
					message.channel.createMessage(`\nOutput\n\`\`\`\n${output}\`\`\``);
				}
			});
		}
	}
};
