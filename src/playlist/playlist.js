exports.list  = function(message) {
		if (playlist[message.guild.id].length > 0) {
			return richSend(message, "MSS Music Player", playlist[message.guild.id].map(function(sound){return JSON.parse(sound).title;}).join("\n"), "#00FF00");
		} else {
			return richSend(message, "MSS Music Player", "There is no music remaining in the playlist.", "#FF0000");
		}
}