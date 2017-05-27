const MSS = require("./../../functions/");
const meta = require("./meta.json");

const emoji = {
	1: ":one:",
	2: ":two:",
	3: ":three:",
	4: ":four:",
	5: ":five:",
	6: ":six:",
	7: ":seven:",
	8: ":eight:",
	9: ":nine:",
	0: ":zero:"
}

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

	let reply = meta[message.data.lang] && meta[message.data.lang].message_message_vote || "message_vote";

	vote.forEach((item, iterator) => {
		message.react(emoji[iterator])
		reply += `\n${emoji[iterator]} ${item}`
	});

	message.channel.send(reply);
}
