const config = require("./../../config.json");
const MSS = require("./../../functions/");
const request = require("request");
const url = require("url");

module.exports = function yt(message) {
	if (!message.guild) return MSS.msg.rich(message, "Error", "You are not allowed to send this command via Direct Messaging.", "#FF0000");
	return message.reply("This function has been disabled in software. Please use the "+config.MSS.prefix+"yt command. See '" + config.MSS.prefix + "man yt' for more details.")

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

	let sound = url.parse(input[1])

	switch (sound.protocol) {
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
