const config = require("./../../config.json");
const data = require("./data.json");

module.exports = function(message) {
	//Reply with an adequate proverb
	message.channel.sendMessage(data.proverbs[Math.floor(Math.random() * data.proverbs.length)]);
}
