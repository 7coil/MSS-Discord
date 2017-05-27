const config = require("./../../config.json");
const exec = require('child_process').exec;
const MSS = require("./../../functions/");

module.exports = function screenshot(message) {
	let input = message.content.replace(/\n/g, "").split(" ");

	if(message.author.id === config.MSS.sysadmin) {
		if(!input[0]) {
			message.channel.send("No input detected");
			return false;
		}

		let command = input.splice(2).join(" ");

		exec(command, (error, stdout, stderr) => {
			let output = "";

			if(stdout){
				output += stdout.replace(/`/g, "'") + "\n";
			}

			if(stderr){
				output += stderr.replace(/`/g, "'") + "\n";
			}

			if(output && output.length > 1900) {
				message.channel.send("```\nUploading output to GitHub\n```")
				MSS.system.gist(message, output);
			} else {
				message.channel.send("```\nOutput\n```");
			}
		});
	}
}
