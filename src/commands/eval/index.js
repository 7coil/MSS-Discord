const config = require("./../../config.json");
const MSS = require("./../../functions/");
const meta = require("./meta.json");

module.exports = function(message) {
	if(message.author.id === config.MSS.sysadmin) {
		let input = message.content.replace (/\n/g, "").split(" ");
		input[0] = input[0].substring(config.MSS.prefix.length);
		try {
			eval(message.content.substring(config.MSS.prefix.length + input[0].length + 1));
			message.channel.sendmessage(`\`\`\`xml
<response>
	<name>` + meta.meta.name + `</name>
	<to>` + message.author.tag + `</to>
	<reply>Command executed successfully.</reply>
</response>
\`\`\``);
		} catch(err) {
			message.channel.sendmessage(`\`\`\`xml
<response>
	<name>` + meta.meta.name + `</name>
	<to>` + message.author.tag + `</to>
	<reply>` + data.cookies[Math.floor(Math.random() * data.cookies.length)] + `</reply>
</response>
\`\`\``);
		}
	} else {
		message.channel.sendmessage(`\`\`\`xml
<response>
	<name>` + meta.meta.name + `</name>
	<to>` + message.author.tag + `</to>
	<error>You do not have permission to execute this command.</error>
</response>
\`\`\``);
	}
}

