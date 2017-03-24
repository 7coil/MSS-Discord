const config = require("./../config.json");
const cookie = require("./cookie.json");
//Math.floor(Math.random() * cookie.proverbs.length)

module.exports = function cookie(message) {
	//Reply with an adequate proverb
	message.reply(cookie.proverbs[0]);
}
