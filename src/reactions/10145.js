const config = require("./../config.json");
const MSS = require("./../functions/");

module.exports = function skip(messageReaction, user) {
	MSS.music.get(messageReaction.message);
}
