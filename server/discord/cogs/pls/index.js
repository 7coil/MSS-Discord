module.exports = (message) => {
	const embed = {
		embed: {
			description: 'Yeah, well, I\'m gonna go build my own "coilpls"... with blackjack and hookers. In fact, forget the "pls"',
			author: {
				name: '7coil#3175',
				url: 'https://moustacheminer.com',
				icon_url: 'https://cdn.discordapp.com/avatars/190519304972664832/c1b55edc77f1b6af8efdde15532dd49a.webp'
			}
		}
	};
	message.channel.send(embed);
};
