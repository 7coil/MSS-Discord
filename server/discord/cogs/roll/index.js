const utils = require('./../../utils.js');

const regex = /(-?\d+)d?(-?\d+)/;

function randInt(d) {
	return Math.floor(Math.random() * d) + 1;
}

module.exports.info = {
	name: 'Dice Roll',
	description: 'Roll a dice or die, with an arbitary number of sides and/or an arbitary number of rolls.',
	category: 'Fun',
	aliases: [
		'roll',
		'die',
		'dice'
	],
	use: [
		{
			name: '',
			value: 'Roll a 6 sided die'
		}, {
			name: '<times>',
			value: 'Roll a 6 sided die the indicated number of times'
		}, {
			name: '<times>d<sides>',
			value: 'Roll an n-sided die the indicated number of times'
		}
	]
};

module.exports.command = function roll(message) {
	const parsed = regex.exec(message.input);
	const rolls = !isNaN(parseInt(parsed[1], 10)) ? parseInt(parsed[1], 10) : 1;
	const sides = !isNaN(parseInt(parsed[2], 10)) ? parseInt(parsed[2], 10) : 6;
	const result = [];
	let sum = 0;
	let output = '';

	if (rolls === 0) {
		output += 'Did not roll ';
	} else {
		output += 'Rolled ';
	}

	if (rolls === 1) {
		output += 'a ';
		if (sides === 0) {
			output += 'shape with no sides.';
		} else if (sides === 1) {
			output += 'mobius strip.';
		} else {
			output += `${sides}-sided dice.`;
		}
	} else {
		output += `${rolls} `;
		if (sides === 0) {
			output += 'die with no sides.';
		} else if (sides === 1) {
			output += 'mobius strips.';
		} else {
			output += `${sides}-sided die.`;
		}
	}

	if (sides < 0 && rolls < 0) {
		output += '\nHowever, such a theoretical shape could not be rolled for a negative number of times.';
		sum = 'Error';
		result.push('Error');
	} else if (sides < 0) {
		output += '\nHowever, such a theoretical shape could not be rolled.';
		sum = 'Error';
		result.push('Error');
	} else if (rolls < 0) {
		output += '\nHowever, such a shape cannot be rolled for a negative number of times.';
		sum = 'Error';
		result.push('Error');
	} else if (rolls > 50000) {
		output += '\nHowever, this was way too much to handle for this bot.';
		sum = 'Error';
		result.push('Error');
	} else if (rolls === 0 || sides === 0) {
		sum = 0;
		result.push(0);
	} else {
		for (let i = 0; i < rolls; i += 1) {
			const value = randInt(sides);
			sum += value;
			result.push(value);
		}
	}

	const embed = {
		embed: {
			description: output,
			fields: [
				{
					name: 'Total',
					value: sum.toString()
				}
			]
		}
	};

	if (result.join(' ').length < 500) {
		embed.embed.fields.push({ name: 'Die output', value: result.join(' ') });
		message.channel.createMessage(embed);
	} else {
		utils.gist(result.join(' '), (url) => {
			embed.embed.fields.push({ name: 'Die output', value: `[Full output](${url})` });
			message.channel.createMessage(embed);
		});
	}
};
