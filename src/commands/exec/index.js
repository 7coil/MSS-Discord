const config = require("./../../config.json");
const exec = require('child_process').exec;

module.exports = function screenshot(message) {
	let input = message.content.replace(/\n/g, "").split(" ");

	if(message.author.id === config.MSS.sysadmin) {
		if(!input[0]) {
			message.channel.sendMessage("```\nNo input detected\n```");
			return false;
		}

		let command = input.splice(2).join(" ");
		let output = "```\n";

		exec(command, {cwd: "/home/mss/"}, (error, stdout, stderr) => {
			if(stdout){
				output += stdout.replace("`", "'") + "\n";
			}

			if(stderr){
				output += stderr.replace("`", "'") + "\n";
			}

			output += "```";

			message.channel.sendMessage(output);
		});
	}
}
