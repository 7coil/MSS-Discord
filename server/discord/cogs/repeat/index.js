const utils = require('./../../utils.js');

module.exports.info = {
	name: 'Repeat single track',
	category: 'Music',
	aliases: [
		'repeat',
		'rpt'
	]
};

module.exports.command = message =>
	utils.music.repeat(message);
