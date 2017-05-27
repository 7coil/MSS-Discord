const config = require("./../../config.json");
const crypto = require("crypto");

module.exports = function screenshot(message) {
	let input = message.content.replace(/\n/g, " ").split(" ");

	input.shift();
	input.shift();
	let stringtoberanked = input.join(" ");

	if (stringtoberanked.length > 100) stringtoberanked = stringtoberanked.substring(0,100) + "...";

	let rank = parseInt(crypto.createHash("md5").update(stringtoberanked).digest("hex"), 16) % 11;

	switch(message.data.lang) {
		case "en":
			message.channel.send(`I rate ${stringtoberanked} a ${rank} out of 10`);
			break;
		case "pi":
			message.channel.send(`Yar! This ${stringtoberanked} gets a ${rank} from me!`);
			break;
		case "tc":
			message.channel.send(`我给 ${stringtoberanked} ${rank * 10} 分`);
			break;
	}

}
