const xml2js = require('xml2js');

module.exports = function xmlReply(input) {

	var builder = new xml2js.Builder();

	var reply = "```xml";
	var reply += builder.buildObject(input);
	var reply += "```"

	message.channel.sendMessage(reply);
}
