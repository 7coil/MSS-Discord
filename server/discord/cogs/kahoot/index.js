const request = require('request');
const config = require('config');

module.exports.info = {
	name: 'Kahoot Search',
	category: 'fun',
	aliases: [
		'kahoot'
	]
};

module.exports.command = (message) => {
	const search = encodeURIComponent(message.input);

	const data = {
		url: `https://create.kahoot.it/rest/kahoots/search/public?query=${search}&limit=5`,
		json: true,
		headers: {
			'User-Agent': config.get('useragent'),
			Authorization: config.get('api').kahoot
		}
	};

	request.get(data, (err, res, body) => {
		if (err) return message.channel.send('Request error!');
		if (body.error) return message.channel.createMessage(body.error);
		if (body.entities.length === 0) return message.channel.createMessage('No Kahoots found.');

		return message.channel.createMessage({
			embed: {
				title: body.entities[0].title,
				url: `https://create.kahoot.it/#quiz/${body.entities[0].uuid}`,
				description: body.entities[0].description,
				timestamp: new Date(body.entities[0].created),
				author: {
					name: body.entities[0].creator_username
				},
				image: {
					url: body.entities[0].cover
				},
				footer: {
					text: `${body.totalHits} Kahoots found`
				}
			}
		});
	});
	return false;
};
