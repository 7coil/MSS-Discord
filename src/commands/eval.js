const config = require("./../config.json");
const MSS = require("./../functions/");

module.exports = function(message) {
	if(message.author.id === config.MSS.sysadmin) {
		let input = message.content.replace (/\n/g, "").split(" ");
		input[0] = input[0].substring(config.MSS.prefix.length);
		eval(message.content.substring(config.MSS.prefix.length + input[0].length + 1));
	} else {
		MSS.msg.react(false, "X");
	}
}

