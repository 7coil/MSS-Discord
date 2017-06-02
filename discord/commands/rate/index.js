const crypto = require("crypto");

module.exports = function screenshot(message) {
	let input = message.content.replace(/\n/g, " ").split(" ");

	if (message.content.length > 100) message.content = message.content.substring(0,100) + "...";

	let rank = parseInt(crypto.createHash("md5").update(message.content).digest("hex"), 16) % 11;

	message.channel.send(`I rate ${message.content} a ${rank} out of 10`);

}
