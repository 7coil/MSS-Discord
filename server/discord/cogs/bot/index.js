const config = require('config');
const request = require('request');
const client = require('./../../');

const regex = /(\d+)/;

const compare = (botsdiscordpw, discordbotsorg) => {
	if (typeof botsdiscordpw === 'string' && typeof discordbotsorg === 'string' && botsdiscordpw !== discordbotsorg) {
		// If they're not the same, and they are strings, return some fancy text
		return `**bots.discord.pw:** ${botsdiscordpw}\n**discordbots.org:** ${discordbotsorg}`;
	}

	// Return one or the other, or return not found
	return botsdiscordpw || discordbotsorg || 'Not found';
};

module.exports.alias = [
	'bot',
	'dbots'
];

module.exports.command = (message) => {
	if (message.channel.guild) message.channel.guild.fetchAllMembers();

	const id = regex.exec(message.input);
	const user = client.users.get(id[1]);

	if (!id || !id[1]) {
		message.channel.createMessage('Please mention a user!');
	} else if (!user) {
		message.channel.createMessage('The user is not in a guild with MSS!');
	} else if (user.bot) {
		const bdpw = {
			method: 'GET',
			json: true,
			uri: `https://bots.discord.pw/api/bots/${id[1]}`,
			headers: {
				'User-Agent': config.get('useragent'),
				Authorization: config.get('api').botsdiscordpw
			}
		};

		const dbli = {
			method: 'GET',
			json: true,
			uri: `https://discordbots.org/api/bots/${id[1]}`,
			headers: {
				'User-Agent': config.get('useragent')
			}
		};

		request(bdpw, (err1, res1, body1) => {
			request(dbli, (err2, res2, body2) => {
				const info = {};

				if (res1.statusCode !== 200 && res2.statusCode !== 200) {
					// If both status codes are not 200, no info about the bot could be found.
					message.channel.createMessage('Could not find info about this bot.');
				} else {
					info.id = compare(body1.user_id, body2.id);
					info.invite = compare(body1.invite_url, body2.invite);
					info.description = compare(body1.description, body2.shortdesc);
					info.library = compare(body1.library, body2.lib);
					info.name = compare(body1.name, body2.username);
					info.owners = [...new Set((body1.owners || []).concat((body2.owners || [])))].reduce((before, current) => `${before}<@${current}> `, '');
					info.prefix = compare(body1.prefix, body2.prefix);
					info.website = compare(body1.website, body2.website);

					message.channel.createMessage({
						embed: {
							title: `Bot info for ${info.name}`,
							description: info.description,
							thumbnail: {
								url: user.avatarURL,
								height: 256,
								width: 256
							},
							fields: [
								{
									name: 'ID',
									value: info.id,
									inline: true
								}, {
									name: 'Invite',
									value: info.invite,
									inline: true
								}, {
									name: 'Library',
									value: info.library,
									inline: true
								}, {
									name: 'Owners',
									value: info.owners,
									inline: true
								}, {
									name: 'Prefix',
									value: info.prefix,
									inline: true
								}, {
									name: 'Website',
									value: info.website,
									inline: true
								}
							]
						}
					});
				}
			});
		});
	} else {
		const bdpw = {
			method: 'GET',
			json: true,
			uri: `https://bots.discord.pw/api/users/${id[1]}`,
			headers: {
				'User-Agent': config.get('useragent'),
				Authorization: config.get('api').botsdiscordpw
			}
		};

		const dbli = {
			method: 'GET',
			json: true,
			uri: `https://discordbots.org/api/bots?limit=50&search=owners,${id[1]}`,
			headers: {
				'User-Agent': config.get('useragent')
			}
		};

		request(bdpw, (err1, res1, body1) => {
			request(dbli, (err2, res2, body2) => {
				const embed = {
					embed: {
						title: `Bots by ${user.username}`,
						thumbnail: {
							url: user.avatarURL,
							height: 256,
							width: 256
						},
						fields: []
					}
				};

				if (res1.statusCode !== 200 && res2.statusCode !== 200) {
					// If both status codes are not 200, no info about the bot could be found.
					message.channel.createMessage('Could not find info about this user.');
				} else {
					if (res1.statusCode === 200) {
						embed.embed.fields.push({
							name: 'Discord Bots (bots.discord.pw)',
							value: body1.bots.map(bot => `${bot.name}: <@${bot.user_id}>\n`).join('')
						});
					}

					if (res2.statusCode === 200) {
						embed.embed.fields.push({
							name: 'Discord Bot List (discordbots.org)',
							value: body2.results.map(bot => `${bot.username}: <@${bot.id}>\n`).join('')
						});
					}

					message.channel.createMessage(embed);
				}
			});
		});
	}
};
