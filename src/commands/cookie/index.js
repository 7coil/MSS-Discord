const config = require("./../../config.json");
const data = require("./data.json");
const meta = require("./meta.json");
const MSS = require("./../../functions/");

module.exports = function(message) {
	reply = {
		response: {
			name: meta.name,
			to: message.author.username,
			error: false,
			output: data.cookies[Math.floor(Math.random() * data.cookies.length)]
		}
	}

	MSS.msg.xml(message, reply);
}
