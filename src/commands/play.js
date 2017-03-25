const config = require("./../config.json");
const MSS = require("./../functions/");
const request = require("request");
const url = require("url").URL;

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

	let url = new url(input[1]);

	switch (url.protocol) {
		case "http:":
			MSS.msg.react(message, true);
			MSS.music.add(message, "http", input[1], input[1], "http://moustacheminer.com/mss.png");
			break;
		case "https:":
			MSS.msg.react(message, true);
			MSS.music.add(message, "https", input[1], input[1], "http://moustacheminer.com/mss.png");
			break;
		default:
			MSS.msg.react(message, false, "link");
			break;
	}
}
