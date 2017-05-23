const r = require("rethinkdb");
const meta = require("./meta.json");
const data = require("./data.json");

module.exports = function (message) {
	//Split message into keywords
	let input = message.content.replace(/\n/g, "").split(" ");

	//If there is no input, send a list of languages
	if (!input[2]) {
		let print = meta[message.data.lang] && meta[message.data.lang].message_choose_lang || "message_choose_lang";
		let langs = [];
		print += "\n```\n"
		Object.keys(data.languages).forEach(function(item) {
			langs.push(`${item} | ${data.languages[message.data.lang][item]}`);
		});

		print += langs.join("\n");
		print += "```";
		return message.reply(print);
	}

	//Get only the first 2 characters.
	input[2] = input[2].substr(0,2)
	console.dir(input);

	if(!Object.keys(data.languages).some((element)=>{return element == message.data.lang})) return message.reply(meta[message.data.lang] && meta[message.data.lang].err_not_found || "err_not_found");

	//ONLY EXCEPTION FOR LANGUAGE
	//Gets the language code from the message,
	//as it is the one that was just set by
	//the (l)user
	message.reply(meta[input[2]] && meta[input[2]].success_found || "success_found");

	r.table("users").insert({
		id: message.member.id,
		lang: input[2].substr(0,2)
	},{
		conflict: "replace"
	}).run(message.client.rethonk);
}
