const config = require('config');
const utils = require('./../../utils.js');

module.exports.info = {
	name: 'Rich JavaScript Evaluation',
	category: 'Development',
	aliases: [
		'js'
	]
};

module.exports.command = (message, client) => { // eslint-disable-line no-unused-vars
	if (config.get('discord').admins.includes(message.author.id)) {
		const embed = {
			embed: {
				title: config.get('name'),
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
			if (output && utils.makeString(output).length < 500) {
				embed.embed.fields.push({ name: 'Output', value: `\`\`\`\n${output}\n\`\`\`` });
				message.channel.createMessage(embed);
			} else if (typeof output !== 'undefined') {
				utils.gist(output, (url) => {
					embed.embed.fields.push({ name: 'Output', value: `[GitHub Gist](${url})` });
					message.channel.createMessage(embed);
				});
			} else {
				embed.embed.fields.push({ name: 'Output', value: 'Undefined' });
				message.channel.createMessage(embed);
			}
		} catch (err) {
			utils.gist(err.stack, (url) => {
				embed.embed.fields.push({ name: 'Error', value: `[GitHub Gist](${url})` });
				message.channel.createMessage(embed);
			});
		}
	}
};
