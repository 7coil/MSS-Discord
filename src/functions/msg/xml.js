const xml2js = require('xml2js');

module.exports = function xmlReply(message, input) {

	var builder = new xml2js.Builder();

	var reply = "```xml";
	reply += builder.buildObject(input);
	reply += "```"

	message.channel.sendMessage(reply);
}
