const MSS = require("./../../functions/");

module.exports = function url(message) {
	let input = message.content.replace (/\n/g, "").split(" ");
	if(input[2]) {
		MSS.music.add(message, "http", input[2], "Custom URL", "https://i.mss.ovh/cloud.png");
	}
}
