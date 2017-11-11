const r = require('./../db');
const client = require('./');
const ytdl = require('ytdl-core');
const bot = require('./');
const { BufferedStream } = require('buffered2');
const { spawn } = require('child_process');
const request = require('request');

const list = async (message, callback) => {
	const playlist = (await r.table('playlist')
		.get(message.channel.guild.id)) || [];
	callback(playlist);
};

const current = async (message, callback) => {
	list(message, (playlist) => {
		callback((playlist.playlist && playlist.playlist[0]) || null);
	});
};

const play = async (message) => {
	current(message, (media) => {
		console.log(media);
		let audio = null;
		if (!media) {
			if (bot.voiceConnections.get(message.channel.guild.id)) bot.leaveVoiceChannel(message.channel.guild.id);
			return;
		} else if (media.type === 'youtube-dl') {
			audio = new BufferedStream();
			const youtube = spawn('youtube-dl', [
				'-o', '-',
				media.media
			]);
			youtube.stdout.pipe(audio);
		} else if (media.type === 'ytdl-core') {
			audio = new BufferedStream();
			ytdl(media.media, { filter: 'audioonly' }).pipe(audio);
		} else if (media.type === 'get') {
			audio = media.media;
		} else if (media.type === 'post') {
			audio = new BufferedStream();
			request.post(media.media).pipe(audio);
		} else {
			// Guess it out!
			audio = media.media;
		}

		bot.voiceConnections.get(message.channel.guild.id).play(audio);
		bot.voiceConnections.get(message.channel.guild.id).once('end', async () => {
			await r.table('playlist')
				.get(message.channel.guild.id)
				.update({
					playlist: r.row('playlist').deleteAt(0)
				});
			play(message);
		});
	});
};
const connect = (message) => {
	if (!bot.voiceConnections.get(message.channel.guild.id)) {
		client.joinVoiceChannel(message.member.voiceState.channelID)
			.catch((err) => {
				message.channel.createMessage(`Error joining channel! ${err.message}`);
			})
			.then(() => {
				play(message);
			});
	}
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
		await r.table('playlist')
			.get(message.channel.guild.id)
			.replace({
				id: message.channel.guild.id,
				playlist: r.row('playlist').default([]).append(details)
			});
		if (!bot.voiceConnections.get(message.channel.guild.id)) connect(message);
	}
};
const skip = (message) => {
	if (!message.member) {
		message.channel.createMessage('You need to be in a Guild!');
	} else if (bot.voiceConnections.get(message.channel.guild.id)) {
		bot.voiceConnections.get(message.channel.guild.id).stopPlaying();
	}
};
const stop = async (message) => {
	if (!message.member) {
		message.channel.createMessage('You need to be in a Guild!');
	} else {
		await r.table('playlist')
			.get(message.channel.guild.id)
			.replace({
				id: message.channel.guild.id,
				playlist: []
			});
		skip(message);
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
