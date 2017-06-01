const execFile = require('child_process').execFile;

module.exports = function screenshot(message) {
	if(message.author.id === message.client.mss.config.sysadmin) {
		execFile('git', message.words, function(error, result) {
			 message.channel.send('```\n' + result + '\n```');
		});
	}
}
