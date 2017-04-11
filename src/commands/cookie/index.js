const config = require("./../../config.json");
const data = require("./data.json");
const meta = require("./meta.json");
const MSS = require("./../../functions/");

module.exports = function(message) {
	//Reply with an adequate cookie, then reply with a cookie reaction.
	MSS.msg.xml(message, meta, data.cookies[Math.floor(Math.random() * data.cookies.length)]);
}
