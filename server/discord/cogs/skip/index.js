const utils = require('./../../utils.js');

module.exports.alias = [
	'skip',
	'fuckthissong'
];

module.exports.command = (message, client) =>
	utils.music.skip(message, client);
