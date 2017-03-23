const config = require("./../config.json");
const MSS = require("./../functions/");

module.exports = function stop(message) {
	var voiceChannel = message.member.voiceChannel;
	if (!voiceChannel || !voiceChannel.connection) {
		//No bot in channel
		return msg.react(message, false, "robot");
	}
	
	if(MSS.msg.isadmin(message)) {
		MSS.music.stop(message);
	} else {
		MSS.msg.react(message, false, "X");
	}
}
