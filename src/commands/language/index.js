const r = require("rethinkdb");
const language = [
	"en",
	"pi"
];

module.exports = function (message) {
	//Split message into keywords
	let input = message.content.replace(/\n/g, "").split(" ");
	console.dir(input);

	if(!language[input[2]]) return message.reply("Invalid language!");

	console.log(`Setting language of ${message.author.tag} to ${input[2]}`);
}


//r.table("users").insert(
//	{"id": message.member.id, "lang": input[2]},
//	conflict = "replace"
//).run(message.guild.rethonk);
