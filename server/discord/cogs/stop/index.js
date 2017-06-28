const utils = require('./../../utils.js');

module.exports.alias = [
	'stop',
	'fuckallsongs'
];

module.exports.command = message =>
	utils.music.stop(message);
