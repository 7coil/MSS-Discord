module.exports = function reactWith(message, meta, output, error) {

	var reply = "";

	reply += "```xml\n";
	reply += "<response>\n"
	reply += "    <name>" + meta.meta.name + "</name>\n"
	reply += "    <to>" + message.author.username + "</to>\n"

	if(output.isArray && output.length > 0) {
		output.forEach(function(element) {
			reply += "    <output>" + element + "</output>\n"
		});
	} else if (output) {
		reply += "    <output>" + output + "</output>\n"
	}

	if(output.isArray && error.length > 0 ) {
		output.forEach(function(element) {
			reply += "    <error>" + element + "</error>\n"
		});
	} else if (error) {
		reply += "    <error>" + error + "</error>\n"
	}

	reply += "</response>\n"
	reply += "```"

	message.reply(reply);

}
