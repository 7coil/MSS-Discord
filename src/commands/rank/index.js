const config = require("./../../config.json");
const crypto = require("crypto");

module.exports = function screenshot(message) {
	let input = message.content.replace(/\n/g, " ").split(" ");
	if (input[2].length > 100) input[2] = input[2].substring(0,100) + "...";

	let md5 = crypto.createHash("md5").update(input[2]);
	let rank = md5 % 10;

	switch(message.data.lang) {
		case en:
			message.channel.send(`I rank ${input[2]} a ${rank} out of 10`);
			break;
		case pi:
			message.channel.send(`Yar! This ${input[2]} gets a ${rank} from me!`)
		case tc:
			message.channel.send(`我给 ${rank * 10} 分`)
	}

}
