const config = require("./../config.json");
const MSS = require("./../functions/");

module.exports = function skip(message) {
	if(MSS.msg.isadmin(message)) {
		MSS.music.skip(message);
	}
}
