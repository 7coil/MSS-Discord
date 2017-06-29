const exec = require('child_process').exec;
const fs = require('fs');

const command = 'vncsnapshot 192.168.0.3:20 vnc.jpg';

module.exports.alias = [
	'vm',
	'virt',
	'virtual',
	'vnc',
	'novnc',
	'mdmck10'
];

module.exports.command = (message) => {
	if (!message.channel || !message.channel.guild || !message.channel.nsfw) {
		message.channel.createMessage('Due to the nature of content potentially found on this VM, please enter a NSFW channel within a guild.');
	} else {
		exec(command, (error, stdout, stderr) => {
			console.log(stdout);
			console.log(stderr);
			const buffer = [];
			const stream = fs.createReadStream('./vnc.jpg');

			stream.on('data', (d) => {
				buffer.push(d);
			});

			stream.on('end', () => {
				const file = Buffer.concat(buffer);
				message.channel.createMessage('Do stuff with the Virtual Machine! http://vnc.moustacheminer.com/', {
					file,
					name: 'vnc.jpg'
				});
			});
		});
	}
};
