const fs = require('fs');
const request = require('request');
const spawn = require('child_process').spawn;

function Player(message, client) {
	this.message = message;
	this.client = client;
	this.playlist = [];
	this.current = {};
	this.pid = {};
	this.connection = null;
	this.connect = () => {
		this.client.joinVoiceChannel(message.member.voiceState.channelID)
			.catch((err) => { // Join the user's voice channel
				this.client.createMessage(message.channel.id, `Error joining channel! ${err.message}`);
				console.log(err);
			})
			.then((connection) => {
				this.connection = connection;
				this.play();
			});
	};
	this.play = () => {
		if (this.connection.playing) this.connection.stopPlaying();
		if (this.playlist.length === 0) return this.client.leaveVoiceChannel(message.member.voiceState.channelID);
		this.current = this.playlist.shift();


		// Try it! If it fails, it skips it.
		try {
			console.log(`Message: Playing from ${this.current.type}`);
			switch (this.current.type) {
			// Stream from YouTube
			case 'youtube': {
				const youtube = spawn('youtube-dl', [
					'-o', '-',
					this.current.url
				]).on('exit', () => {
					console.log('youtube finished');
					this.pid.youtube = null;
				});

				this.pid.youtube = youtube.pid;
				this.connection.play(youtube.stdout);
				break;
			}
			// Stream from a local file
			case 'local': {
				this.connection.play(fs.createReadStream(this.current.url));
				break;
			}
			// Stream from the internet!
			case 'http': {
				this.connection.play(request.get(this.current.url));
				break;
			}
			case 'post': {
				this.connection.play(request.post(this.current.url));
				break;
			}
			default: {
				console.log('Failure: Incorrect audio type');
				this.message.channel.createMessage(`${this.current.type} is not a valid audio provider.`);
				this.play();
			}
			}

			// The stream has ended, therefore it can go on to the next song
			this.connection.once('end', () => {
				this.play();
			});
		} catch (e) {
			console.log(`Failure: ${e.message}`);
			this.message.channel.createMessage(`${e.message} - Skipping...`);
			this.play();
		}
		return false;
	};
	this.add = (type, url, title, thumb) => {
		this.playlist.push({
			type,
			url,
			title,
			thumb
		});

		// If the bot is not playing, enter the channel and start playing
		if (!(this.connection && this.connection.playing)) {
			this.connect();
		}
	};
	this.skip = () => {
		if (this.connection && this.connection.playing) {
			this.connection.stopPlaying();
		}
	};
	this.stop = () => {
		this.current = {};
		this.playlist = [];
		this.skip();
	};
}

module.exports = Player;

process.on('unhandledRejection', (err) => {
	console.log(`Uncaught Promise Error:\n${err.stack}`);
});

process.on('uncaughtException', (err) => {
	if (err.message !== 'read ECONNRESET') {
		//console.log(err.stack);
		//return process.exit(1);
	}
	return false;
});
