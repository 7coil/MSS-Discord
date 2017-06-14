const request = require('request');
const config = require('config');
const utils = require('./../../utils.js');

const logo = 'http://www.dafont.com/forum/attach/orig/6/0/603950.png';

// An array to store Kahoots that will stop after the question
const stopme = [];

// An array to store running games
const games = [];

function embedify(kahoot) {
	return {
		embed: {
			title: kahoot.title,
			url: `https://create.kahoot.it/#quiz/${kahoot.uuid}`,
			description: kahoot.description,
			timestamp: new Date(kahoot.created),
			author: {
				name: kahoot.creator_username
			},
			image: {
				url: kahoot.cover
			},
			footer: {
				text: 'DiscordKahoot'
			}
		}
	};
}

function add(message, id) {
	if (games.includes(message.channel.id)) return message.channel.send('There is already a Kahoot game in this channel');
	games.push(message.channel.id);

	const data = {
		url: `https://create.kahoot.it/rest/kahoots/${id}`,
		json: true,
		headers: {
			'User-Agent': config.get('useragent'),
			Authorization: config.get('api').kahoot
		}
	};

	return request.get(data, (err, res, body) => {
		if (err) return message.channel.send('Request error!');
		if (body.error) return message.channel.send(body.error);

		message.channel.send('Loaded Kahoot! Starting game in 10 seconds...', embedify(body));
		let part = 0;
		const points = [];

		function question() {
			if (stopme.includes(message.channel.id)) {
				stopme.splice(stopme.indexOf(message.channel.id), 1);
				games.splice(games.indexOf(message.channel.id), 1);
				return message.channel.send('The Kahoot has been stopped by an Administrator.');
			}

			// The part number is the same as the length of the quiz, therefore the quiz must have ended
			if (part === body.questions.length) {
				games.splice(games.indexOf(message.channel.id), 1);
				return message.channel.send('End of Game!');
			}

			// Get the answers for this question
			let print = '**Choices:**\n```md';
			let correct = '**Answers:**';
			let answers = [];
			let answered = [];

			body.questions[part].choices.forEach((choice, iterator) => {
				print += `\n${iterator + 1}. ${choice.answer}`;
				if (choice.correct) {
					correct += `\n${iterator + 1}. ${choice.answer}`;
					answers.push(iterator + 1);
				}
			});
			print += '```';

			const embed = {
				embed: {
					title: body.title,
					url: `https://create.kahoot.it/#quiz/${body.uuid}`,
					description: body.questions[part].question.replace(/<.?i>/g, '_').replace(/<.?b>/g, '**'),
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
			};

			message.channel.send(embed);

			return setTimeout(() => {
				message.channel.send(print)
					.then((msg) => {
						// Get a random soundtrack to play
						const altsound = Math.floor(Math.random() * 3) + 1;
						let alt = '';
						let length = null;
						if (altsound === 1) {
							length = utils.pad(body.questions[part].time / 1000, 2);
						} else {
							alt = `alt${utils.pad(altsound, 2)}-`;
							length = utils.pad(body.questions[part].time / 1000, 3);
						}
						const soundtrack = `https://play.kahoot.it/theme/base/audio/${alt}answer_${length}sec.ogg`;
						console.log(soundtrack);

						// Start playing Kahoot music (if needed)
						utils.music.addSilent(message, 'https', soundtrack, 'Kahoot', logo);

						msg.channel.awaitMessages((m) => {
							const input = m.content.replace(/\n/g, '').split(' ');
							if (Number.isInteger(parseInt(input[0], 10)) && parseInt(input[0], 10) <= 4 && parseInt(input[0], 10) >= 1 && !answered.includes(m.author.id)) {
								answered.push(m.author.id);
								return true;
							}

							return false;
						}, { time: body.questions[part].time, errors: ['time'] })
							.catch((collected) => {
								console.log(collected.size);

								collected.forEach((message1) => {
									if (!points[message1.author.id]) points[message1.author.id] = 0;
									const input = message1.content.replace(/\n/g, '').split(' ');
									if (answers.includes(parseInt(input[0], 10))) points[message1.author.id] += 1;
								});

								let scoreboard = '**Scoreboard:**';

								Object.keys(points).forEach((user) => {
									scoreboard += `\n\`${points[user]}\` - ${message.client.users.get(user).username}`;
								});

								message.channel.send(`${correct}\n${scoreboard}\n**Next question in 5 seconds...**`);

								// Proceed to the next question
								answered = [];
								answers = [];
								part += 1;

								setTimeout(() => {
									question();
								}, 5000);
							});
					});
			}, 5000);
		}

		return setTimeout(() => {
			question();
		}, 10000);
	});
}

function adminCheck(message) {
	if (utils.isadmin(message)) {
		return true;
	}
	message.channel.send('You are not an administrator!');
	return false;
}

function stop(message) {
	adminCheck(message);
	if (!games.includes(message.channel.id)) return message.channel.send('There is no Kahoot game ongoing in this channel');
	if (stopme.includes(message.channel.id)) return message.channel.send('This Kahoot is already marked for stopping');
	return stopme.push(message.channel.id);
}

exports.add = add;
exports.stop = stop;
exports.embed = embedify;
