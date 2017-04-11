const config = require("./../../config.json");
const MSS = require("./../../functions/");
const meta = require("./meta.json");

module.exports = function(message) {
	if(message.author.id === config.MSS.sysadmin) {
		let input = message.content.replace (/\n/g, "").split(" ");
		input[0] = input[0].substring(config.MSS.prefix.length);
		try {
			eval(message.content.substring(config.MSS.prefix.length + input[0].length + 1));
			MSS.msg.xml(message, meta, "Success!");
		} catch(err) {
			MSS.msg.xml(message, meta, "", err.stack);
		}
	} else {
		MSS.msg.xml(message, meta, "", "You do not have permission to use this command");
	}
}

