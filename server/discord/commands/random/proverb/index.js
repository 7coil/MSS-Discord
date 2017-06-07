const data = require("./data.json");

module.exports = function(message) {
	message.reply(data.data[Math.floor(Math.random() * data.data.length)]);
}
