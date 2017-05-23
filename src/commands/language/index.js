const r = require("rethinkdb");
const data = require("./data.json");

module.exports = function (message) {
	//Split message into keywords
	let input = message.content.replace(/\n/g, "").split(" ");
	console.dir(input);

	console.log(input[2]);
	console.log(data.languages[input[2]]);

	if(data.languages[input[2]]) {
		console.log(`Setting language of ${message.author.tag} to ${input[2]}`);
	} else {
		return message.reply("Invalid language!");
	}


}


//r.table("users").insert(
//	{"id": message.member.id, "lang": input[2]},
//	conflict = "replace"
//).run(message.guild.rethonk);
