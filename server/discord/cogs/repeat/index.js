const utils = require('./../../utils.js');

module.exports.info = {
	name: 'Repeat single track',
	description: 'Enable repeat mode (as an admin)',
	category: 'Music',
	aliases: [
		'repeat',
		'rpt'
	],
	use: [
		{
			name: '',
			value: 'Enable repeat mode'
		}
	]
};

module.exports.command = message =>
	utils.music.repeat(message);
