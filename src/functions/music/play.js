const yt = require('ytdl-core');
const fs = require('fs');

module.exports = function playlistPlay(message) {
	var voiceChannel = message.member.voiceChannel;
	
	if(!voiceChannel) {
		return message.reply("Get in a channel!");
	}
	
	if (playlist[message.guild.id].length > 0) {
		global.current[message.guild.id] = JSON.parse(playlist[message.guild.id].shift());
		message.channel.sendMessage('**Music Control Panel**')
			.then(function(message) {
				message.react(String.fromCodePoint(10145));
				message.react(String.fromCodePoint(8505));
				message.react(String.fromCodePoint(128240));
			});
		switch (current[message.guild.id]["type"]) {
			case "youtube":
				global.stream[message.guild.id] = yt(global.current[message.guild.id]["url"], {audioonly: true});
				break;
			case "local":
				global.stream[message.guild.id] = fs.createReadStream(global.current[message.guild.id]["url"]);
				break;
		}
	} else {
		if (voiceChannel && voiceChannel.connection) voiceChannel.leave();
		playlist[message.guild.id] = [];
		if (stream[message.guild.id]) stream[message.guild.id].destroy();
		richSend(message, "MSS Music Player", "The playlist has ended.", "#00FF00");
		return;
	}
}