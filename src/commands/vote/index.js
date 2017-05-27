const MSS = require("./../../functions/");
const meta = require("./meta.json");

module.exports = function yt(message) {
	let input = message.content.replace (/\n/g, "").split(" ");

	input.shift();
	input.shift();
	let items = input.join(" ");
	let vote = items.split(";");

	if(vote.length < 1) {
		return message.channel.send("Too few options!");
	} else if (vote.length > 9) {
		return message.channel.send("Too many options!");
	}

	let reply = meta[message.data.lang] && meta[message.data.lang].message_choose_lang || "message_vote";

	vote.forEach((item, iterator) => {
		message.react(String.fromCodePoint(57884 + iterator))
		reply += `\n${String.fromCodePoint(57884 + iterator)} ${item}`
	});

	message.channel.send(reply);
}

