const utils = require('./../../utils.js');

module.exports.info = {
	name: 'Skip',
	description: 'Skip the currently playing track (as an admin)',
	category: 'Music',
	aliases: [
		'skip',
		'fuckthis'
	],
	use: [
		{
			name: '',
			value: 'Skip the currently playing track'
		}
	]
};

module.exports.command = message =>
	utils.music.skip(message);
