const exec = require('child_process').exec;
const config = require('config');

module.exports = (message) => {
	if (config.get('admins').includes(message.author.id)) {
		if (!message.content) {
			message.channel.send('No input detected');
			return false;
		}

		exec(message.content, (error, stdout, stderr) => {
			let output = '';

			if (stdout) {
				output += `${stdout.replace(/`/g, '\'')}\n`;
			}

			if (stderr) {
				output += `${stdout.replace(/`/g, '\'')}\n`;
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
	return false;
};
