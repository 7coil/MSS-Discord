const xml2js = require('xml2js');

module.exports = function xmlReply(message, input) {

	var builder = new xml2js.Builder();

	var reply = "```xml\n";
	reply += builder.buildObject(input);
	reply += "\n```"

	message.channel.sendMessage(reply);
}
