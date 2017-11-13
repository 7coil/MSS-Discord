const r = require('./../db');
const client = require('./');
const bot = require('./');

const getPlayer = (message) => {
	if (!message.member) {
		return Promise.reject(new Error('Not a guild'));
	}
	const player = client.voiceConnections.get(message.channel.guild.id);
	if (player) {
		return Promise.resolve(player);
	}
	const options = {};
	return client.voiceConnections.join(message.channel.guild.id, message.member.voiceState.channelID, options);
};

const stop = async (message) => {
	const player = bot.voiceConnections.get(message.channel.guild.id);
	if (player) {
		player.stop();
		player.disconnect();
		await r.table('playlist')
			.get(message.channel.guild.id)
			.replace({
				id: message.channel.guild.id,
				playlist: []
			});
	}
};

const list = async (message, callback) => {
	const playlist = (await r.table('playlist')
		.get(message.channel.guild.id)) || [];
	callback(playlist);
};

const current = (message, callback) => {
	list(message, (playlist) => {
		callback((playlist.playlist && playlist.playlist[0]) || null);
	});
};

const play = (message) => {
	current(message, (media) => {
		getPlayer(message).then((player) => {
			if (media) {
				console.log(media);
				player.play(media.track);
				player.on('disconnect', (err) => {
					if (err) console.log(err);
					console.log('Disconnected');
				});
				player.on('error', (err) => {
					if (err.type === 'TrackExceptionEvent') {
						message.channel.createMessage('Something went wrong while decoding the track');
					} else {
						message.channel.createMessage('Generic music error message here');
					}
				});
				player.on('stuck', (err) => {
					console.log('Stuck!');
					console.log(err);
				});
				player.once('end', async (data) => {
					if (!(data.reason && data.reason === 'REPLACED')) {
						await r.table('playlist')
							.get(message.channel.guild.id)
							.update({
								playlist: r.row('playlist').deleteAt(0)
							});
						play(message);
					}
				});
			} else {
				setTimeout(async () => {
					player.stop();
					player.disconnect();
				}, 2000);
			}
		});
	});
};

const connect = (message) => {
	getPlayer(message)
		.then(() => {
			play(message);
		});
};
const add = async (message, details) => {
	if (!message.member) {
		if (!details.silent) {
			message.channel.createMessage('You need to be in a Guild!');
		}
	} else if (!message.member.voiceState || !message.member.voiceState.channelID) {
		if (!details.silent) {
			message.channel.createMessage('You need to be in a Voice Channel!');
		}
	} else {
		if (Array.isArray(details)) {
			await r.table('playlist')
				.get(message.channel.guild.id)
				.replace({
					id: message.channel.guild.id,
					playlist: r.row('playlist').default([]).union(details)
				});
		} else {
			await r.table('playlist')
				.get(message.channel.guild.id)
				.replace({
					id: message.channel.guild.id,
					playlist: r.row('playlist').default([]).append(details)
				});
		}
		if (!bot.voiceConnections.get(message.channel.guild.id)) connect(message);
	}
};
const skip = (message) => {
	const player = bot.voiceConnections.get(message.channel.guild.id);
	if (player) {
		player.stop();
	}
};

exports.connect = connect;
exports.add = add;
exports.stop = stop;
exports.skip = skip;
exports.list = list;

/*

{
	media: Object or string,
	type: string,
	name: string
}

*/
