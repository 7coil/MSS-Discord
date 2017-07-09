const r = require('./../../../db');
const client = require('./../../');
const spawn = require('child_process').spawn;
const request = require('request');
const utils = require('./../../utils.js');
const ytdl = require('ytdl-core');

const connections = {};

const list = (message, callback) => {
	if (!message.member) {
		message.channel.createMessage('You need to be in a Guild!');
	} else {
		r.table('playlist')
			.get(message.channel.guild.id)
			.run(r.conn, (err, res) => {
				if (err) throw new Error('Failed to read Rethonk(TM) playlist.');
				if (res === null) {
					callback([]);
				} else {
					callback(res.playlist, res.repeat);
				}
			});
	}
};
const play = (message) => {
	list(message, (playlist) => {
		const after = () => {
			// When the playlist ends, either delete the next track, or not,
			// depending on if they have single repeat on or not
			connections[message.channel.guild.id].once('end', () => {
				r.table('playlist')
					.get(message.channel.guild.id)
					.run(r.conn, (err1, result) => {
						if (err1) throw new Error('Failed to obtain repeat data.');
						if (result.repeat) {
							play(message);
						} else {
							r.table('playlist')
								.get(message.channel.guild.id)
								.update({
									playlist: r.row('playlist').deleteAt(0)
								})
								.run(r.conn, (err2) => {
									if (err2) throw new Error('Failed to modify Rethonk(TM) playlist.');
									play(message);
								});
						}
					});
			});

			connections[message.channel.guild.id].once('error', (err) => {
				message.channel.createMessage(`Error playing audio! ${err.message}`);
			});
		};

		// If the playlist is empty, leave.
		if (playlist.length === 0 && connections[message.channel.guild.id].channelID) {
			client.leaveVoiceChannel(connections[message.channel.guild.id].channelID);
			connections[message.channel.guild.id] = false;
		} else if (playlist[0].type === 'ytdl') { // Play from youtube-dl, which can do many many things.
			const youtube = spawn('youtube-dl', [
				'-o', '-',
				playlist[0].media
			]);

			connections[message.channel.guild.id].play(youtube.stdout);
			after();
		} else if (playlist[0].type === 'ytdl-core') { // Play with ytdl-core, which can do many many things.
			const stream = ytdl(playlist[0].media.url, playlist[0].media.search);

			connections[message.channel.guild.id].play(stream);
			after();
		} else if (playlist[0].type === 'get') { // Play directly with a GET request
			const ffmpeg = spawn('ffmpeg', [
				'-i', playlist[0].media,
				'-f', 'wav',
				'-ac', '2',
				'pipe:1'
			]);

			ffmpeg.stdout.on('error', (err) => {
				message.channel.createMessage(`Error playing audio! ${err.message}`);
			});
			ffmpeg.stderr.on('error', (err) => {
				message.channel.createMessage(`Error playing audio! ${err.message}`);
			});

			connections[message.channel.guild.id].play(ffmpeg.stdout);
			after();
		} else if (playlist[0].type === 'post') { // Send POST data then play the file
			const ffmpeg = spawn('ffmpeg', [
				'-i', 'pipe:0',
				'-f', 'wav',
				'-ac', '2',
				'pipe:1'
			]);

			ffmpeg.stdout.on('error', (err) => {
				message.channel.createMessage(`Error playing audio! ${err.message}`);
			});
			ffmpeg.stderr.on('error', (err) => {
				message.channel.createMessage(`Error playing audio! ${err.message}`);
			});

			request.post(playlist[0].media).pipe(ffmpeg.stdin);
			connections[message.channel.guild.id].play(ffmpeg.stdout);
			after();
		} else {
			throw new Error('Invalid audio type provided.');
		}
	});
};
const connect = (message) => {
	if (!connections[message.channel.guild.id]) {
		connections[message.channel.guild.id] = true;
		client.joinVoiceChannel(message.member.voiceState.channelID)
			.catch((err) => { // Join the user's voice channel
				message.channel.createMessage(`Error joining channel! ${err.message}`);
				console.log(err);
			})
			.then((connection) => {
				if (connection) {
					connections[message.channel.guild.id] = connection;
					play(message);
				}
			});
	}
};
const add = (message, details) => {
	if (!message.member) {
		if (!details.slient) {
			message.channel.createMessage('You need to be in a Guild!');
		}
	} else if (!message.member.voiceState || !message.member.voiceState.channelID) {
		if (!details.slient) {
			message.channel.createMessage('You need to be in a Voice Channel!');
		}
	} else {
		// Add the details to the playlist. If the playlist doesn't exist, create it.
		r.table('playlist')
			.get(message.channel.guild.id)
			.replace({
				id: message.channel.guild.id,
				playlist: r.row('playlist').append(details).default([details]),
				repeat: r.row('repeat').default(false)
			})
			.run(r.conn, (err) => {
				if (err) throw err;

				// If the bot is not connected to the guild, run the init procedures
				if (!connections[message.channel.guild.id]) connect(message);
			});
	}
};
const skip = (message) => {
	if (!message.member) {
		message.channel.createMessage('You need to be in a Guild!');
	} else if (utils.isadmin(message.member)) {
		if (connections[message.channel.guild.id] && connections[message.channel.guild.id].playing) connections[message.channel.guild.id].stopPlaying();
	} else {
		message.channel.createMessage('You do not have permission to perform this command!');
	}
};
const stop = (message) => {
	if (!message.member) {
		message.channel.createMessage('You need to be in a Guild!');
	} else if (utils.isadmin(message.member)) {
		r.table('playlist')
			.get(message.channel.guild.id)
			.replace({
				id: message.channel.guild.id,
				playlist: [],
				repeat: false
			})
			.run(r.conn, (err) => {
				if (err) throw err;
				skip(message);
			});
	} else {
		message.channel.createMessage('You do not have permission to perform this command!');
	}
};
const repeat = (message) => {
	if (!message.member) {
		message.channel.createMessage('You need to be in a Guild!');
	} else if (utils.isadmin(message.member)) {
		r.table('playlist')
			.get(message.channel.guild.id)
			.replace({
				id: message.channel.guild.id,
				playlist: r.row('playlist'),
				repeat: r.row('repeat').not().default(false)
			})
			.run(r.conn, (err) => {
				if (err) throw err;
			});
	} else {
		message.channel.createMessage('You do not have permission to perform this command!');
	}
};

exports.connect = connect;
exports.add = add;
exports.stop = stop;
exports.skip = skip;
exports.list = list;
exports.repeat = repeat;

/*

{
	media: Object or string,
	type: string,
	name: string
}

*/
