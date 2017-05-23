const r = require("rethinkdb");
const meta = require("./meta.json");
const data = require("./data.json");

module.exports = function (message) {
	//Split message into keywords
	let input = message.content.replace(/\n/g, "").split(" ");
	console.dir(input);

	if(!data.languages[input[2]]) return message.reply(meta[message.data.lang].err);

	message.reply(meta[input[2]].set);

	r.table("users").insert({
		id: message.member.id,
		lang: input[2]
	},{
		conflict: "replace"
	}).run(message.client.rethonk);
}
