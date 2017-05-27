const MSS = require("./../../functions/");
const meta = require("./meta.json");

const filter = () => { return true; }

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

	let reply = meta[message.data.lang] && meta[message.data.lang].message_vote || "message_vote";

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

			message.awaitReactions(filter, {time: 10000, errors: ['time']})
				.catch((collected) => {

					let voters = [];
					let votes = [];

					//Get all users into the voters array
					collected.forEach((messageReaction)=>{
						messageReaction.users.forEach((user)=>{
							voters.push(user.id);
						});
					});

					//Fot each unique voter, create an array
					[...new Set(voters)].forEach((voter) => {
						votes[voter] = [];
					})

					//Push each reaction to each user
					collected.forEach((messageReaction)=>{
						messageReaction.users.forEach((user)=>{
							votes[voter].push(messageReaction.emoji.id)
						});
					});

					console.dir(votes);
				});
		});
}
