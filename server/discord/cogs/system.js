const config = require('config');

module.exports = [
	{
		names: [
			'ping'
		],
		command: (message) => {
			let s = 0;

			if (message.channel.guild) {
				s = client.guildShardMap[message.channel.guild.id];
			}

			message.channel.createMessage(`\`\`\`\n${client.shards.map(shard => `${s === shard.id ? '>' : ' '}Shard ${shard.id} | ${shard.latency}ms`).join('\n')}\n\`\`\``);
		}
	}, {
		names: [
			'help'
		],
		command: (message) => {
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
		}
	}
];
