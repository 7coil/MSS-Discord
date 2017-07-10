const utils = require('./../../utils.js');

module.exports.info = {
	name: 'Stop',
	description: 'Stop all sounds/music (as an admin)',
	category: 'Music',
	aliases: [
		'stop',
		'fuckthat'
	],
	use: [
		{
			name: '',
			value: 'Stop the currently playing track'
		}
	]
};

module.exports.command = message =>
	utils.music.stop(message);
