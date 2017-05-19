const config = require("./../config.json");
const MSS = require("./../functions/");

module.exports = function skip(messageReaction, user) {
	MSS.music.skip(messageReaction.message);
}
