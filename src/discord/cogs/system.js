const Command = require('../class/Command');

module.exports = [
	new Command({
		name: 'test',
		flag: [{
			flag: 'r',
			long: 'reply',
			type: 'string',
			desc: 'Reply with the message'
		}]
	})
];
