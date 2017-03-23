const config = require("./../config.json");
const MSS = require("./../functions/");
const searchYT = require('youtube-node');
const searchYTClient = new searchYT();
const yt = require('ytdl-core');
searchYTClient.setKey(config.API.youtube);

module.exports = function yt(message) {
	let input = message.content.replace (/\n/g, "").split(" ");
	//Get the voice channel that it's going to play to.
	let voiceChannel = message.member.voiceChannel;
	//Check if the user is inside a voice channel or has inputted anything.
	if (!voiceChannel) {
		MSS.msg.react(message, false, "call");
		return false;
	} else if (!input[1]) {
		MSS.msg.react(message, false, "link");
		return false;
	}

	searchYTClient.search(message.content.substring(input[0].length + 1), 1, function(error, result) {
		if (error || !result["items"][0]) {
			console.log(error);
			message.reply(error);
			MSS.msg.react(message, false, "bomb");
			return false;
		} else {
			if (info["length_seconds"] > 3600 && !MSS.msg.isadmin(message)) return MSS.msg.react(message, false, "ruler");
			MSS.music.add(message, "youtube", "https://youtube.com/watch?v=" + result["items"][0]["id"]["videoId"], result["items"][0]["snippet"]["thumbnails"]["default"]["url"], result["items"][0]["snippet"]["title"]);
		}
	});
}
