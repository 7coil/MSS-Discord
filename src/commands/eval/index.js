const config = require("./../../config.json");
const MSS = require("./../../functions/");

module.exports = function(message) {
	if(message.author.id === config.MSS.sysadmin) {
		let input = message.content.replace (/\n/g, "").split(" ");
		input.shift();
		input.shift();
		try {
			eval(input.join(" "));
		} catch(err) {
			message.channel.send(`\`\`\``+err.stack+`\`\`\``);
		}
	} else {
		MSS.msg.react(message, false, "X");
	}
}

