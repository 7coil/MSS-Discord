const utils = require('./../../utils.js');

module.exports.alias = [
	'list',
	'playlist'
];

module.exports.command = function list(message) {
	utils.music.list(message);
}
