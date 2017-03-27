const config = require("./../../config.json");
const data = require("./data.json");

module.exports = function(message) {
	//Reply with an adequate cookie, then reply with a cookie reaction.
	message.reply(data.cookies[Math.floor(Math.random() * data.cookies.length)]);
	message.react(String.fromCodePoint(129376));
}
