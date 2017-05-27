const MSS = require("./../../functions/");
const meta = require("./meta.json");

const emoji = {
	1: "\u0031\u20e3",
	2: "\u0032\u20e3",
	3: "\u0033\u20e3",
	4: "\u0034\u20e3",
	5: "\u0035\u20e3",
	6: "\u0036\u20e3",
	7: "\u0037\u20e3",
	8: "\u0038\u20e3",
	9: "\u0039\u20e3",
	0: "\u0030\u20e3"
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
		reply += `\n${emoji[iterator + 1]} ${item}`
	});

	message.channel.send(reply)
		.then((message) => {
			vote.forEach((item, iterator) => {
				setTimeout(() => {
					message.react(emoji[iterator + 1]);
				}, 1000 * iterator);
			});


		});
}
