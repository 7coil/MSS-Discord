const utils = require('./../../utils.js');

module.exports.info = {
	name: 'Playlist',
	category: 'Music',
	aliases: [
		'list',
		'playlist',
		'queue'
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

			message.channel.createMessage(reply);
		}
	});
};
