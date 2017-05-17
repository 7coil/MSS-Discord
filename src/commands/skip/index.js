const config = require("./../../config.json");
const MSS = require("./../../functions/");

module.exports = function skip(message) {
	MSS.music.skip(message);
}
