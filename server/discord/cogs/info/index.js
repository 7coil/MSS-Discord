const os = require('os');
const utils = require('./../../utils.js');
const config = require('config');

// Non-changing statistics
// (x64) AMD Athlon (x3) Something @ 3ghz (clocked at ????MHz)
const hardwareinfo = `(${os.arch()}) ${os.cpus()[0].model} clocked at ${os.cpus()[0].speed} MHz`;
const softwareinfo = `[${os.type()}] ${os.release()}`;

module.exports.info = {
	name: 'Information',
	description: 'Get info regarding the bot.',
	category: 'Info',
	aliases: [
		'info'
	],
	use: [
		{
			name: '',
			value: 'Obtain info'
		}
	]
};

module.exports.command = (message, client) => {
	const embed = {
		embed: {
			title: config.get('name'),
			fields: [
				{
					name: 'Node.js',
					value: process.version,
					inline: true
				},
				{
					name: 'Uptime',
					value: utils.timestamp(process.uptime()),
					inline: true
				},
				{
					name: 'Guilds',
					value: client.guilds.size,
					inline: true
				},
				{
					name: 'PID',
					value: process.pid,
					inline: true
				},
				{
					name: 'Hardware',
					value: hardwareinfo
				},
				{
					name: 'Software',
					value: softwareinfo
				},
				{
					name: 'Licence',
					value: `${config.get('name')}, an instance of MSS-Discord is licenced under the MIT Licence`
				}
			]
		}
	};

	return message.channel.createMessage(embed);
};
