const config = require("./../../config.json");
const data = require("./data.json");
const meta = require("./meta.json");

module.exports = function(message) {
	//Reply with an adequate cookie, then reply with a cookie reaction.
	message.channel.sendmessage(`\`\`\`xml
<response>
	<name>` + meta.meta.name + `</name>
	<to>` + message.author.tag + `</to>
	<reply>` + data.cookies[Math.floor(Math.random() * data.cookies.length)] + `</reply>
</response>
\`\`\``);
}
