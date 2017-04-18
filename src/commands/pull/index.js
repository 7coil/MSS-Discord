const config = require("./../../config.json");
const exec = require('child_process').exec;

module.exports = function screenshot(message) {
	if(message.author.id === config.MSS.sysadmin) {
		exec("git pull", function(error, stdout, stderr) {
			 message.channel.sendMessage("```\n" + stdout + "\n```");
		});
	}
}
