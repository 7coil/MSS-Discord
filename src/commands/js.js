const config = require("./../config.json");
const MSS = require("./../functions/");
const Sandbox = require("sandbox");

module.exports = function(message) {
	var s = new Sandbox;

	if(message.author.id === config.MSS.sysadmin) {
		let input = message.content.replace (/\n/g, "").split(" ");
		input[0] = input[0].substring(config.MSS.prefix.length);
		try {
			s.run(message.content.substring(config.MSS.prefix.length + input[0].length + 1), function() {
				message.reply(`\n\`\`\``+output.result+`\`\`\``);
			});
		} catch(err) {
			message.reply("Something happened and an ACTUAL ERROR happened outside the sandbox.");
		}
	} else {
		MSS.msg.react(message, false, "X");
	}
}

