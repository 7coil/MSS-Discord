const utils = require('./../../utils.js');

module.exports.alias = [
	'skip',
	'fuckthissong'
];

module.exports.command = message =>
	utils.music.skip(message);
