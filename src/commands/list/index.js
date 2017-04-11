const config = require("./../../config.json");
const MSS = require("./../../functions/");
const meta = require("./meta.json");

module.exports = function stop(message) {
	if (!message.guild) {
		reply = {
			response: {
				name: meta.meta.name,
				to: message.author.username,
				error: true,
				output: "This command has been disabled for Direct Messaging"
			}
		}

		MSS.msg.xml(message, reply);

		return false;
	}

	var voiceChannel = message.member.voiceChannel;
	if (!voiceChannel || !voiceChannel.connection) {
		reply = {
			response: {
				name: meta.meta.name,
				to: message.author.username,
				error: true,
				output: "There is no bot in the channel."
			}
		}

		MSS.msg.xml(message, reply);

		return false;
	}

	if(MSS.msg.isadmin(message)) {
		MSS.music.stop(message);
	} else {
		reply = {
			response: {
				name: meta.meta.name,
				to: message.author.username,
				error: true,
				output: "You do not have permission to stop."
			}
		}

		MSS.msg.xml(message, reply);
	}


}
