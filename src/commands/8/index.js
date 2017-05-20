const config = require("./../../config.json");
const data = require("./data.json");

module.exports = function(message) {
	//Reply with an adequate 8 ball
	message.reply(data.messages[Math.floor(Math.random() * data.messages.length)]);
	message.react(String.fromCodePoint(127921));
}
