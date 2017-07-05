const utils = require('./../../utils.js');

module.exports.info = {
	name: 'Stop',
	category: 'music',
	aliases: [
		'stop',
		'fuckthat'
	]
};

module.exports.command = message =>
	utils.music.stop(message);
