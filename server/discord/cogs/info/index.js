const os = require('os');

// Non-changing statistics
// (x64) AMD Athlon (x3) Something @ 3ghz (clocked at ????MHz)
const hardwareinfo = `(${os.arch()}) ${os.cpus()[0].model} clocked at ${os.cpus()[0].speed} MHz`;
const softwareinfo = `[${os.type()}] ${os.release()}`;

module.exports.alias = [
	'info',
	'information'
];

module.exports.command = (message, client) => {
	// Realtime statistics
	const pinginfo = `${message.guild.shard.latency.toFixed(2)}ms`;
	const guildcount = message.client.guilds.size;
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
					value: client.utils.timestamp(process.uptime()),
					embed: true
				},
				{
					name: 'Guilds',
					value: guildcount,
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
