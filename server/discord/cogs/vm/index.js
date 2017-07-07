const exec = require('child_process').exec;
const fs = require('fs');

const command = 'vncsnapshot 192.168.0.3:19 vnc.jpg';

module.exports.info = {
	name: 'vnc.moustacheminer.com',
	category: 'nsfw',
	aliases: [
		'vnc',
		'vm',
		'virt'
	]
};

module.exports.command = (message) => {
	if (!message.channel || !message.channel.guild || !message.channel.nsfw) {
		message.channel.createMessage('Due to the nature of content potentially found on this VM, please enter a NSFW channel within a guild.');
	} else {
		exec(command, () => {
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
