const config = require("./../config.json");
const MSS = require("./../functions/");

module.exports = function yt(message) {
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
			yt.getInfo(result["items"][0]["id"]["videoId"], function(err, info) {
				if (!info) {
					MSS.msg.react(message, false, "bomb");
					return false;
				}
				if (info["length_seconds"] > 3600 && !isAdmin(message)) return reactWith(message, false, "ruler");
				MSS.music.add(message, "youtube", "https://youtube.com/watch?v=" + info["video_id"], info["title"], info["thumbnail_url"]);
			});
		}
	});
}
