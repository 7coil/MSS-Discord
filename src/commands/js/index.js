const config = require("./../../config.json");
const MSS = require("./../../functions/");
const Discord = require("discord.js");
const meta = require("./meta.json");

module.exports = function(message) {
	var reply;

	reply = {
		response: {
			name: meta.meta.name,
			to: message.author.username,
			error: true,
			output: "XML-Discord cannot parse XML. XML-Discord is coded in XML. Not in Javascript."
		}
	}

	MSS.msg.xml(message, reply);
}
