module.exports = function xmlReply(message, meta, output, error) {

	console.dir(output);
	console.dir(error);

	var reply = "";

	reply += "```xml\n";
	reply += "<response>\n"
	reply += "    <name>" + meta.meta.name + "</name>\n"
	reply += "    <to>" + message.author.username + "</to>\n"

	if(output && Array.isArray(output)) {
		output.forEach(function(element) {
			reply += "    <output>" + element + "</output>\n"
		});
	} else if (output) {
		reply += "    <output>" + output + "</output>\n"
	}

	if(error && Array.isArray(error)) {
		error.forEach(function(element) {
			reply += "    <error>" + element + "</error>\n"
		});
	} else if (error) {
		reply += "    <error>" + error + "</error>\n"
	}

	reply += "</response>\n"
	reply += "```"

	message.channel.sendMessage(reply);

}
