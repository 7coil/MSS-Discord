module.exports.info = {
	name: 'PK Fire!',
	category: 'Fun',
	description: 'Matt Parker burns a bamboo calculator',
	aliases: [
		'fire'
	],
	use: [
		{
			name: '',
			value: 'pk fire!'
		}
	]
};

module.exports.command = message =>
	message.channel.createMessage('https://mss.ovh/pkfire.gif');
