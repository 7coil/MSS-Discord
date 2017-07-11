const utils = require('./../../utils.js');

module.exports.info = {
	name: 'Playlist',
	description: 'List the current sounds and music that is stored within the playlist.',
	category: 'Music',
	aliases: [
		'list',
		'playlist',
		'queue'
	],
	use: [
		{
			name: '',
			value: 'List the playlist'
		}
	]
};
module.exports.command = (message) => {
	utils.music.list(message, (playlist, repeat) => {
		if (playlist.length === 0) {
			message.channel.createMessage('The playlist is empty.');
		} else {
			let reply = `https://discord.mss.ovh/music/${message.channel.guild.id}\n\`\`\`\n`;
			reply += `Repeat mode is ${repeat ? 'enabled' : 'disabled'}\n`;
			playlist.forEach((element, index) => {
				reply += `[${index || 'Current'}] ${element.title}\n`;
			});
			reply += '```';

			if (reply && reply.length > 1900) {
				message.channel.createMessage(`https://discord.mss.ovh/music/${message.channel.guild.id}\nThe list is too long to display. Please view the playlist online.`);
			} else {
				message.channel.createMessage(reply);
			}
		}
	});
};
