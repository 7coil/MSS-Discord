const utils = require('./../../utils.js');

module.exports.info = {
	name: 'Skip',
	category: 'Music',
	aliases: [
		'skip',
		'fuckthis'
	]
};

module.exports.command = message =>
	utils.music.skip(message);
