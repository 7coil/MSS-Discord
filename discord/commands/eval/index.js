module.exports = function(message) {
	if(message.author.id === message.client.mss.config.sysadmin) {
		try {
			eval(message.content);
		} catch(err) {
			message.channel.send(`\`\`\``+err.stack+`\`\`\``);
		}
	} else {
		message.client.mss.functions.msg.react(message, false, "X");
	}
}

