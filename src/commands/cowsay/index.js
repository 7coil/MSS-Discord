const execFile = require('child_process').execFile;

module.exports = function screenshot(message) {
	let input = message.content.replace(/\n/g, "").split(" ");

	if (message.channel.id === "110373943822540800" && message.content.includes("memedog")) {
		message.reply("Memedog is literally cancer, so I disabled it.");
		return false;
	}

	//Get everything after cowsay
	input.shift();

	if(!input[1]) {
		input[1] = "Have you mooed today?";
	}

	execFile('cowsay', input, function(error, result) {
		 message.channel.sendMessage('```\n' + result + '\n```');
	});
}
