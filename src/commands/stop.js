const config = require("./../config.json");
const MSS = require("./../functions/");

module.exports = function stop(message) {
	if(MSS.msg.isadmin(message)) {
		MSS.music.stop(message);
	}
}
