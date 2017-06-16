const utils = require('./../../utils.js');

module.exports.alias = [
	'list',
	'playlist',
	'queue'
];

module.exports.command = function list(message) {
	utils.music.list(message);
}
