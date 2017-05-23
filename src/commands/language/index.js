const r = require("rethinkdb");
const meta = require("./meta.json");
const data = require("./data.json");

module.exports = function (message) {
	//Split message into keywords
	let input = message.content.replace(/\n/g, "").split(" ");
	console.dir(input);

	if(!data.languages[input[2]]) return message.reply(typeof meta[input[2]] != "undefined" && meta[input[2]].err ||  || "ERR");

	//ONLY EXCEPTION FOR LANGUAGE
	//Gets the language code from the message,
	//as it is the one that was just set by
	//the (l)user
	message.reply(typeof meta[input[2]] != "undefined" && meta[input[2]].set || "SET");

	r.table("users").insert({
		id: message.member.id,
		lang: input[2]
	},{
		conflict: "replace"
	}).run(message.client.rethonk);
}
