module.exports = function(message) {
	let input = message.content.replace(/\n/g, " ").split(" ");

	if(!input[2]) return message.reply("Message ID required");

	message.channel.fetchMessage(input[2])
		.then(message => {
			message.react(String.fromCodePoint(128514));
			message.react(String.fromCodePoint(128175));
			message.react(String.fromCodePoint(128076));
		})
		.catch(error => {
			message.reply(`Error: ${error.message}`);
		});
}
