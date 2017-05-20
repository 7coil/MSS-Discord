const config = require("./../../config.json");
const exec = require('child_process').exec;

module.exports = function screenshot(message) {
	let input = message.content.replace(/\n/g, "").split(" ");

	if(message.author.id === config.MSS.sysadmin) {
		if(!input[0]) {
			message.channel.send("No input detected");
			return false;
		}

		let command = input.splice(2).join(" ");
		let output = "```\n";

		exec(command, (error, stdout, stderr) => {
			if(stdout){
				output += stdout.replace(/`/g, "'") + "\n";
			}

			if(stderr){
				output += stderr.replace(/`/g, "'") + "\n";
			}

			output += "```";

			message.channel.send(output);
		});
	}
}
