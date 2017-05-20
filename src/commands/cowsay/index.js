const execFile = require('child_process').execFile;

module.exports = function screenshot(message) {
	let input = message.content.replace(/\n/g, "").split(" ");

	//Get everything after cowsay
	input.shift();
	input.shift();

	if(!input[0]) {
		input[0] = "Have you mooed today?";
	}

	execFile('cowsay', input, function(error, result) {
		 message.channel.sendMessage('```\n' + result + '\n```');
	});
}
