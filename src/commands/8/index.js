const config = require("./../../config.json");
const data = require("./data.json");

module.exports = function(message) {
	//Reply with an adequate 8 ball
	message.reply(data[message.data.lang][Math.floor(Math.random() * data[message.data.lang].length)] || "Translate me!");
	message.react(String.fromCodePoint(127921));
}
