const r = require("rethinkdb");
const lang = [
	"en",
	"pi"
];

module.exports = function (message) {
	//Split message into keywords
	let input = message.content.replace(/\n/g, "").split(" ");

	console.log(`Setting language of ${message.member.tag} to ${input[2]}`);

	//Check if the input is a valid language
	if(lang[input[2]]) {
		console.log(`Successfully found language`);

		r.table("users").insert(
			{"id": message.member.id, "lang": input[2]},
			conflict = "replace"
		).run(message.guild.rethonk);
	}
}
