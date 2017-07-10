const client = require('./../../');
const utils = require('./../../utils.js');

module.exports.info = {
	name: 'Prune messages',
	category: 'Utilities',
	description: 'Delete the last 50 messages sent by the bot or by a specified person.',
	aliases: [
		'clean',
		'prune',
		'delete',
		'delet'
	],
	use: [
		{
			name: '',
			value: 'Prune messages sent by the bot'
		},
		{
			name: '<user>',
			value: 'Prune messages sent by the specific user. Needs permission to do so.'
		}
	]
};

module.exports.command = (message) => {
	if (utils.isadmin(message.member)) {
		const regex = /\w+/g;

		const input = regex.exec(message.input);
		let prune = '';

		if (input && input[0] && message.input) {
			prune = input[0];
		} else {
			prune = client.user.id;
		}

		message.channel.getMessages().then((messages) => {
			const delet = messages.filter((msg) => {
				if (prune === 'bots') {
					return msg.author.bot;
				}
				return msg.author.id === prune;
			});

			if (delet.length === 0) {
				message.channel.createMessage(`Nothing to ${message.command}!`);
			} else {
				let i = 0;
				const deleteMessage = () => {
					delet[i].delete()
						.then(() => {
							i += 1;
							if (delet[i + 1]) {
								deleteMessage();
							} else {
								message.channel.createMessage(`Deleted ${i} messages`);
							}
						})
						.catch(() => {
							message.channel.createMessage(`Failed to ${message.command} messages`);
						});
				};
				deleteMessage();
			}
		});
	} else {
		message.channel.createMessage(`You do not have permission to ${message.command}!`);
	}
};
