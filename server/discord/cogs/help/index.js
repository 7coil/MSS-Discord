const config = require('config');

module.exports.info = {
	name: 'Help',
	description: 'Get help regarding the bot.',
	category: 'Info',
	aliases: [
		'help',
		'man'
	],
	use: [
		{
			name: '',
			value: 'Obtain help'
		}
	]
};

module.exports.command = (message) => {
	const embed = {
		embed: {
			title: config.get('name'),
			fields: [
				{
					name: 'Commands',
					value: `For a list of all commands, run \`${message.prefix} commands\`, or visit the online list [here](${config.get('url').manual})`
				},
				{
					name: 'Prefixes',
					value: config.get('discord').prefix.join(' OR ')
				},
				{
					name: 'Links',
					value: `[Website](${config.get('url').website})\n[Discord Server](${config.get('url').discord})\n[Invite Bot](${config.get('url').invite})\n[GitHub](${config.get('url').github})`
				},
				{
					name: 'Licence',
					value: `${config.get('name')}, an instance of MSS-Discord is licenced under the MIT Licence`
				}
			]
		}
	};

	message.channel.createMessage(embed);
};
