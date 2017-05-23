const config = require("./../../config.json");
const data = require("./data.json");

module.exports = function(message) {
	message.reply(data[message.data.lang] && data[message.data.lang][Math.floor(Math.random() * data[message.data.lang].length)] || "success_found");
	message.react(String.fromCodePoint(127921));
}
