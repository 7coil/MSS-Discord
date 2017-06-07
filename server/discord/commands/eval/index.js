const config = require('config');

module.exports = function(message) {
	if (config.get("admins").includes(message.author.id)) {
		try {
			eval(message.content);
		} catch(err) {
			message.channel.send(`\`\`\``+err.stack+`\`\`\``);
		}
	} else {
		message.client.mss.functions.msg.react(message, false, "X");
	}
}

