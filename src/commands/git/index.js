const config = require("./../../config.json");
const exec = require('child_process').execFile;

module.exports = function screenshot(message) {
	let input = message.content.replace(/\n/g, "").split(" ");

	if(message.author.id === config.MSS.sysadmin) {
		if(!input[0]) {
			message.channel.sendMessage("```\nNo input detected\n```");
			return false;
		}

		let output = "```\n";

		input.slice(2);

		exec('git', input, (error, stdout, stderr) => {
			if(stdout){
				output += stdout + "\n";
			}

			if(stderr){
				output += stderr + "\n";
			}

			output += "```";

			message.channel.sendMessage(output);
		});
	}
}
