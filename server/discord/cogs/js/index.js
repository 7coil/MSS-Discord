const config = require('config');

module.exports = (message, client) => {
	if (config.get('admins').includes(message.author.id)) {
		const embed = {
			embed: {
				title: 'MSS-Discord',
				fields: [
					{
						name: 'Input',
						value: message.input,
					}
				]
			}
		};

		try {
			const output = eval(`(${message.input})`); // eslint-disable-line no-eval
			if (output.length < 500) {
				embed.embed.fields.push({ name: 'Output', value: `\`\`\`\n${output}\n\`\`\`` });
			}
			client.utils.gist(message.content, (url) => {
				embed.embed.fields.push({ name: 'Output', value: `[GitHub Gist](${url})` });
			});
		} catch (err) {
			client.utils.gist(err.stack, (url) => {
				embed.embed.fields.push({ name: 'Error', value: `[GitHub Gist](${url})` });
			});
		}
		return message.channel.send(embed);
	}
	return false;
};
