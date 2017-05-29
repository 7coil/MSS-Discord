const API = require("./../../api.json");
const config = require("./../../config.json");
const Discord = require("discord.js");
const request = require('request');
const MSS = require("./../")

//An array to store Kahoots that will stop after the question
const stopme = [];

//An array to store running games
const games = [];

exports.add = add;
exports.stop = stop;

function add(message, id) {
	if(games.includes(message.channel.id)) return message.channel.send("There is already a Kahoot game in this channel");
	games.push(message.channel.id);

	let data = {
		url: `https://create.kahoot.it/rest/kahoots/${id}`,
		json: true,
		headers: {
			"User-Agent": config.MSS.useragent,
			Authorization: API.kahoot
		}
	}

	request.get(data, (err, res, body) => {
		if(err) return message.channel.send("Request error!");
		if(body.error) return message.channel.send(body.error);
		let embed = {
			embed: {
				title: body.title,
				url: `https://create.kahoot.it/#quiz/${body.uuid}`,
				description: body.description,
				timestamp: new Date(body.created),
				author: {
					name: body.creator_username
				},
				image: {
					url: body.cover
				},
				footer: {
					text: `Loaded Kahoot! Starting in 10 seconds...`
				}
			}
		}

		message.channel.send(embed);
		let part = 0;
		let points = [];

		setTimeout(()=>{
			question();
		}, 10000);

		function question() {
			if(stopme.includes(message.channel.id)) {
				stopme.splice(stopme.indexOf(message.channel.id), 1);
				games.splice(games.indexOf(message.channel.id), 1);
				return message.channel.send("The Kahoot has been stopped by an Administrator.");
			}

			//The part number is the same as the length of the quiz, therefore the quiz must have ended
			if(part == body.questions.length) {
				games.splice(games.indexOf(message.channel.id), 1);
				return message.channel.send("End of Game!");
			}

			//Get the answers for this question
			let print = "**Choices:**\n```md";
			let correct = "**Answers:**";
			let answers = [];
			let answered = [];

			body.questions[part].choices.forEach((choice, iterator)=>{
				print += `\n${iterator + 1}. ${choice.answer}`;
				if(choice.correct) {
					correct += `\n${iterator + 1}. ${choice.answer}`
					answers.push(iterator + 1);
				};
			});
			print += "```";

			let embed = {
				embed: {
					title: body.title,
					url: `https://create.kahoot.it/#quiz/${body.uuid}`,
					description: body.questions[part].question,
					timestamp: new Date(body.created),
					author: {
						name: body.creator_username
					},
					image: {
						url: body.questions[part].image
					},
					footer: {
						text: `DiscordKahoot | Question ${part + 1} out of ${body.questions.length}`
					}
				}
			}

			message.channel.send(embed);

			setTimeout(()=>{
				message.channel.send(print)
					.then((message)=>{
						message.channel.awaitMessages((m) => {
								let input = m.content.replace(/\n/g, "").split(" ");
								if (Number.isInteger(parseInt(input[0])) && parseInt(input[0]) <= 4 && parseInt(input[0]) >= 1 && !answered.includes(message.author.id))) {
									answered.push(message.author.id);
									return true;
								} else {
									return false;
								}

							}, {time: body.questions[part].time, errors: ["time"]})
							.catch((collected) => {
								console.log(collected.size);

								collected.forEach((message)=>{
									if(!points[message.author.id]) points[message.author.id] = 0;
									let input = message.content.replace(/\n/g, "").split(" ");
									if(answers.includes(parseInt(input[0]))) points[message.author.id] += 1;
								});

								let scoreboard = "**Scoreboard:**";

								for(let key in points) {
									scoreboard += `\n\`${points[key]}\` - ${message.client.users.get(key).username}`
								}

								message.channel.send(`${correct}\n${scoreboard}\n**Next question in 5 seconds...**`);

								//Proceed to the next question
								answered = [];
								answers = [];
								part++;

								setTimeout(()=>{
									question();
								}, 5000);
							});
					});
			}, 5000);
		}

	});
}

function stop(message) {
	adminCheck(message);
	if(!games.includes(message.channel.id)) return message.channel.send("There is no Kahoot game ongoing in this channel");
	if(stopme.includes(message.channel.id)) return message.channel.send("This Kahoot is already marked for stopping");
	stopme.push(message.channel.id);
}

function adminCheck(message) {
	if(MSS.msg.isadmin(message)) {
		return true;
	} else {
		message.channel.send("You are not an administrator!");
		return false;
	}
}
