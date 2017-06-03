const crypto = require("crypto");

module.exports = function screenshot(message) {
	let input = message.content.replace(/\n/g, " ").split(" ");

	if (!message.content) message.content = "The MSS help menu";

	outof = parseInt(message.words[0], 10) + 1 || 11;

	if (message.content.length > 100) message.content = message.content.substring(0,100) + "...";

	let rank = parseInt(crypto.createHash("md5").update(message.content.toLowerCase()).digest("hex"), 16) % outof;

	message.channel.send(`I rate ${message.content} a ${rank} out of ${outof}`);

}
