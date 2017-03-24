const config = require("./../config.json");
const cookie = require("./cookie.json");

module.exports = function cookie(message) {
	//Reply with an adequate proverb
	message.reply(cookie.proverb[Math.floor(Math.random() * cookie.proverb.length)]);
}
