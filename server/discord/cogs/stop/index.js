const utils = require('./../../utils.js');

module.exports.alias = [
	'stop',
	'fuckallsongs'
];

module.exports.command = (message, client) =>
	utils.music.stop(message, client);
