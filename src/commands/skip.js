const config = require("./../config.json");
const MSS = require("./../functions/");

module.exports = function skip(message) {
	if (!message.guild) return MSS.msg.rich(message, "Error", "You are not allowed to send this command via Direct Messaging.", "#FF0000");
	var voiceChannel = message.member.voiceChannel;
	if (!voiceChannel || !voiceChannel.connection) {
		//No bot in channel
		return msg.react(message, false, "robot");
	}
	
	if(MSS.msg.isadmin(message)) {
		MSS.music.skip(message);
	} else {
		MSS.msg.react(message, false, "X");
	}
}
