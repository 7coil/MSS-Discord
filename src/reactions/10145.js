const config = require("./../config.json");
const MSS = require("./../functions/");

module.exports = function skip(messageReaction, user) {
	if (!MSS.reaction.isadmin(user, messageReaction.message.channel)) return;
	MSS.music.skip(messageReaction.message);
}
