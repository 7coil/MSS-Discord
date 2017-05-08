const config = require("./../../config.json");
const execFile = require('child_process').execFile;

module.exports = function screenshot(message) {
	let input = message.content.replace(/\n/g, "").split(" ");

	if(message.author.id === config.MSS.sysadmin) {
		if(!input[2]) {
			message.channel.sendMessage("```\nNo input detected\n```");
			return false;
		}

		//Get everything after cowsay
		input.shift();
		input.shift();

		if(!input[0]) {
			input[0] = "Have you git pulled today?";
		}

		execFile('git', input, function(error, result) {
			 message.channel.sendMessage('```\n' + result + '\n```');
		});
	}
}
