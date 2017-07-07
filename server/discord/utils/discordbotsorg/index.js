const request = require('request');
const config = require('config');

module.exports = function dbotsupdate(client) {
	const data = {
		url: `https://discordbots.org/api/bots/${client.user.id}/stats`,
		method: 'POST',
		json: true,
		headers: {
			'User-Agent': config.get('useragent'),
			authorization: config.get('api').discordbotsorg
		},
		body: {
			server_count: client.guilds.size,
			shard_id: 0,
			shard_count: config.get('discord').shards
		}
	};

	request.post(data, (err, res, body) => {
		console.log(err, body);
	});
};
