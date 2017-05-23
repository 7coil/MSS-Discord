const r = require("rethinkdb");
const meta = require("./meta.json");
const data = require("./data.json");

module.exports = function (message) {
	//Split message into keywords
	let input = message.content.replace(/\n/g, "").split(" ");

	//If there is no input, send a list of languages
	if (!input[2]) {
		let print = typeof meta[message.data.lang] != "undefined" && meta[message.data.lang].success_found || "message_choose_lang";
		let langs = [];
		print += "\n```\n"
		data.languages.forEach(function(item) {
			langs.push(item[message.data.lang]);
		});

		print += langs.join(`, `);
		print += "```";
		return message.reply(print);
	}

	console.dir(input);

	if(!data.languages[message.data.lang]) return message.reply(typeof meta[message.data.lang] != "undefined" && meta[message.data.lang].err_not_found || "err_not_found");

	//ONLY EXCEPTION FOR LANGUAGE
	//Gets the language code from the message,
	//as it is the one that was just set by
	//the (l)user
	message.reply(typeof meta[input[2]] != "undefined" && meta[input[2]].success_found || "success_found");

	r.table("users").insert({
		id: message.member.id,
		lang: input[2]
	},{
		conflict: "replace"
	}).run(message.client.rethonk);
}
