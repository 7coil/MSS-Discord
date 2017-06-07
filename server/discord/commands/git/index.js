const execFile = require('child_process').execFile;
const config = require('config');

module.exports = function (message) {
	if (config.get("admins").includes(message.author.id)) {
		execFile('git', message.words, function(error, result) {
			 message.channel.send('```\n' + result + '\n```');
		});
	}
}
