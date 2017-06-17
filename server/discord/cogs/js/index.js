const config = require('config');
const utils = require('./../../utils.js');

module.exports.alias = [
	'js',
	'javascript'
];

module.exports.command = (message) => {
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
			if (output && output.length > 500) {
				embed.embed.fields.push({ name: 'Output', value: `\`\`\`\n${output}\n\`\`\`` });
				return message.channel.createMessage(embed);
			} else if (typeof output !== 'undefined') {
				utils.gist(message.content, (url) => {
					embed.embed.fields.push({ name: 'Output', value: `[GitHub Gist](${url})` });
					return message.channel.createMessage(embed);
				});
			} else {
				embed.embed.fields.push({ name: 'Output', value: 'Undefined' });
			}
		} catch (err) {
			utils.gist(err.stack, (url) => {
				embed.embed.fields.push({ name: 'Error', value: `[GitHub Gist](${url})` });
				return message.channel.createMessage(embed);
			});
		}
	}
	return false;
};
