const os = require('os');
const utils = require('./../../utils.js');

// Non-changing statistics
// (x64) AMD Athlon (x3) Something @ 3ghz (clocked at ????MHz)
const hardwareinfo = `(${os.arch()}) ${os.cpus()[0].model} clocked at ${os.cpus()[0].speed} MHz`;
const softwareinfo = `[${os.type()}] ${os.release()}`;

module.exports.alias = [
	'info',
	'information'
];

module.exports.command = (message, client) => {
	const embed = {
		embed: {
			title: 'MSS-Discord',
			fields: [
				{
					name: 'Node.js',
					value: process.version,
					embed: true
				},
				{
					name: 'Uptime',
					value: utils.timestamp(process.uptime()),
					embed: true
				},
				{
					name: 'Guilds',
					value: client.guilds.size,
					embed: true
				},
				{
					name: 'PID',
					value: process.pid,
					embed: true
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
					value: 'This copy of MSS-Discord is licenced under the MIT Licence'
				}
			]
		}
	};

	return message.channel.createMessage(embed);
};
