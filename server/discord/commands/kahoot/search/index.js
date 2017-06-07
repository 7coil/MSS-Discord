const request = require('request');
const config = require('config');

module.exports = function(message) {
	let search = encodeURIComponent(message.content);

	let data = {
		url: `https://create.kahoot.it/rest/kahoots/search/public?query=${search}&limit=5`,
		json: true,
		headers: {
			"User-Agent": config.get("useragent"),
			Authorization: config.get("api").kahoot
		}
	}
	request.get(data, (err, res, body) => {
		if(err) return message.channel.send("Request error!");
		if(body.error) return message.channel.send(body.error);
		if(body.entities.length === 0) {
			return message.reply("No Kahoots found.");
		} else {
			return message.channel.send(`${body.totalHits} Kahoots found - Displaying top result`, message.client.mss.functions.kahoot.embed(body.entities[0]));
		}
	});
	return false;
}
