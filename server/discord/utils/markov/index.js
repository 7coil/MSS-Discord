const r = require('./../../../db');
const client = require('./../../');

function flatten(array) {
	return array.reduce((acc, val) =>
		acc.concat(Array.isArray(val) ? flatten(val) : val), []);
}

function choice(array) {
	// Flatten the array
	const arr = flatten(array);
	// Select a random item in the array. That's it.
	return arr[Math.floor(Math.random() * arr.length)];
}

function generate(user, callback) {
	r.table('markov')
		.filter({ name: user })
		.run(r.conn, (err1, cursor) => {
			if (err1) throw new Error('Fuck!');
			cursor.toArray((err2, result) => {
				if (err2) throw new Error('Fuck!');

				console.dir(result);
				console.dir(result[0]);

				// Find a first word
				let word = choice(result[0].start);

				// Add the first word to the array
				const title = [word];

				// If there's a next word available,
				// while (wordstats[word]) {
				while (Object.keys(result[0].stats).includes(word)) {
					// Select a random next word
					word = choice(result[0].stats[word]);

					// Add the next word to the array
					title.push(word);

					// If the word is a word that ends the sentence, stop
					if (result[0].end.includes(word)) break;
				}

				const author = client.users.get(result[0].author);

				const embed = {
					content: `If I recall correctly, ${author.username} said:`,
					embed: {
						description: title.join(' '),
						author: {
							name: `${author.username}#${author.discriminator}`,
							icon_url: author.avatarURL
						}
					}
				};

				// Join the sentence and call the callback.
				callback(embed);
			});
		});
}

function save(message) {
	const keys = [];
	const stats = {};
	const words = message.content.split(/\s+/);
	// Get the first word
	const start = words[0];
	// Get the last word
	const end = words[words.length - 1];

	function callback() {
		r.table('markov')
			.filter({ author: message.author.id })
			.update({
				start: r.row('start').append(start),
				end: r.row('end').append(end),
				stats: r.row('stats').do(statistics =>
					r.expr(stats).keys().map(key =>
						r.expr([key, statistics(key).default([]).append(r.expr(stats)(key))])
					).coerceTo('object')
				)
			})
			.run(r.conn, (err) => {
				if (err) throw new Error('Fuck!');
			});
	}

	// For every word, make an object with every word said.
	words.forEach((word, i) => {
		// If it's the last word, don't try to continue.
		if (words.length === (i + 1)) {
			callback();
		} else if (keys.includes(word)) {
			// Push the next word into the statistics bin
			stats[word].push(words[i + 1]);
		} else {
			// Otherwise, create the array and then add the word.
			stats[word] = [words[i + 1]];
			keys.push(word);
		}
	});
}

exports.choice = choice;
exports.generate = generate;
exports.save = save;

// Maek new markovs.

// r.db("discord").table("markov").insert({
//   author: "190519304972664832",
//   name: "coil",
//   start: [],
//   end: [],
//   stats: {}
// })
