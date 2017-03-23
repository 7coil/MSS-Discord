const config = require("./../config.json");
const MSS = require("./../functions/");



module.exports = function(message) {
	if(MSS.msg.isadmin(message)) {
		eval(message.content.substring(config.MSS.prefix.length + input[0].length + 1));
	} else {
		MSS.msg.react(false, "X");
	}
}
