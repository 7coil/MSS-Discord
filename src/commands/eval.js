const config = require("./../config.json");
const MSS = require("./../functions/");

module.exports = function(message) {
	if(message.author.id === config.MSS.sysadmin) {
		let input = message.content.replace (/\n/g, "").split(" ");
		input[0] = input[0].substring(config.MSS.prefix.length);
		try {
			eval(message.content.substring(config.MSS.prefix.length + input[0].length + 1));
		} catch(err) {
			message.channel.sendMessage(`\`\`\``+err.stack+``\`\`\``);
		}
	} else {
		MSS.msg.react(message, false, "X");
	}
}

