const utils = require('./../../utils.js');

module.exports.info = {
	name: 'Stop',
	category: 'Music',
	aliases: [
		'stop',
		'fuckthat'
	]
};

module.exports.command = message =>
	utils.music.stop(message);
