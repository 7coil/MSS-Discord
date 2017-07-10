const config = require('config');
const crypto = require('crypto');
const utils = require('./../../utils.js');
const data = require('./data.json');

const media = 'client/media/numberwang/';
const thumb = 'http://www.bbc.co.uk/staticarchive/43714e6c85f7e7019777027ecaad71fe4edcaeac.jpg';
const desc = 'Hello, and welcome to Numberwang, the maths quiz that simply everyone is talking about!';

module.exports.info = {
	name: 'Numberwang',
	description: 'Check if a number is Numberwang.',
	category: 'Fun',
	aliases: [
		'numberwang'
	],
	use: [
		{
			name: '',
			value: 'Play a random numberwang'
		}, {
			name: '<number>',
			value: 'Check if a number is actually numberwang'
		}
	]
};

module.exports.command = (message) => {
	const hash = crypto.createHash('md5').update(message.input + config.get('secret')).digest('hex').substring(0, 4);
	const rank = parseInt(hash, 16) % 2;
	const audio = {
		type: 'get',
		from: 'Numberwang',
		thumb,
		desc,
		silent: true
	};

	if (!message.input) {
		audio.title = 'Numberwang';
		audio.media = media + utils.choice(data.noreply);
	} else if (rank) {
		message.channel.createMessage('That\'s numberwang!');
		audio.title = 'That\'s numberwang!';
		audio.media = media + utils.choice(data.numberwang);
	} else {
		message.channel.createMessage(`I'm sorry ${utils.choice(data.contestants)}, but that's not Numberwang.`);
		audio.title = 'That\'s not Numberwang.';
		audio.media = media + utils.choice(data.fail);
	}

	utils.music.add(message, audio);
};
