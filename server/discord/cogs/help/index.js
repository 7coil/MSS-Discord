const config = require('config');

module.exports = (message) => {
	const embed = {
		embed: {
			title: 'MSS-Discord',
			fields: [
				{
					name: 'Commands',
					value: `For help on a specific command, please refer to the [Moustacheminer Manual Manual](${config.get('url').manual})`
				},
				{
					name: 'Prefixes',
					value: config.get('prefix').join(' OR ')
				},
				{
					name: 'Links',
					value: `[Website](${config.get('url').website})\n[Discord Server](${config.get('url').discord})\n[Invite Bot](${config.get('url').invite})\n[GitHub](${config.get('url').github})`
				},
				{
					name: 'Licence',
					value: 'This copy of MSS-Discord is licenced under the MIT Licence'
				}
			]
		}
	};

	message.channel.createMessage(embed);
};
