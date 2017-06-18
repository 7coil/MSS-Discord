const data = require('./data.json');

const regex = /(\d+)/;

function escapeChar(name) {
	return name.replace(/\*/g, '\\*')
		.replace(/_/g, '\\_')
		.replace(/~/g, '\\~')
		.replace(/`/g, '\\`');
}

module.exports.alias = [
	'parker',
	'matt',
	'matt parker',
	'square'
];

module.exports.command = (message, client) => {
	const url = data.data[Math.floor(Math.random() * data.data.length)];
	const id = regex.exec(message.input);
	let sender = null;
	let reciever = null;

	if (!id[1]) {
		sender = 'Nobody';
		reciever = escapeChar(message.author.username);
	} else if (message.author.id === id[1]) {
		sender = 'yourself';
		reciever = escapeChar(message.author.username);
	} else if (client.users.get(id[1])) {
		sender = escapeChar(message.author.username);
		reciever = escapeChar(client.users.get(id[1]).username);
	} else {
		sender = escapeChar(message.author.username);
		reciever = 'A user that doesnt exist';
	}

	message.channel.createMessage(`**${reciever}**, you got Parker Squared by **${sender}**!\n${url}`);
};
