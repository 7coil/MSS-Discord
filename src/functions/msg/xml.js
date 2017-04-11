module.exports = function reactWith(message, meta, output, error) {

	var reply = "";

	reply += "```xml\n";
	reply += "<response>\n"
	reply += "    <name>" + meta.meta.name + "</name>\n"
	reply += "    <to>" + message.author.tag + "</to>\n"

	if(output.length > 0 && output.isArray) {
		output.forEach(element) {
			reply += "    <output>" + element + "</output>\n"
		}
	} else if (output) {
		reply += "    <output>" + output + "</output>\n"
	}

	if(error.length > 0 && output.isArray) {
		output.forEach(element) {
			reply += "    <error>" + element + "</error>\n"
		}
	} else if (error) {
		reply += "    <error>" + error + "</error>\n"
	}

	reply += "</response>"

}
