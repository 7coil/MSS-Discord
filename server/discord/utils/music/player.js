const fs = require('fs');
const request = require('request');
const spawn = require('child_process').spawn;

function Player(message) {
	this.message = message;
	this.playlist = [];
	this.current = {};
	this.pid = {};
	this.connection = null;
	this.connect = () => {
		this.message.member.voiceChannel
			.join()
			.then((connection) => {
				this.connection = connection;
				this.play();
			});
	};
	this.play = () => {
		if (this.playlist.length === 0) return this.message.member.voiceChannel.leave();
		this.current = this.playlist.shift();

		// Make an ffmpeg stream
		const ffmpeg = spawn('ffmpeg', [
			'-i', 'pipe:0',
			'-f', 'wav',
			'pipe:1'
		]);

		// Set the PID of this.
		this.pid.ffmpeg = ffmpeg.pid;

		// Try it! If it fails, it skips it.
		try {
			console.log(`Message: Playing from ${this.current.type}`);
			// Send the correct input to the ffmpeg stream
			switch (this.current.type) {
			// Stream from YouTube
			case 'youtube': {
				const youtube = spawn('youtube-dl', [
					'-o', '-',
					this.current.url
				]);
				this.pid.youtube = youtube.pid;

				youtube.on('close', () => {
					console.log('youtube finished');
					this.pid.youtube = null;
				});
				youtube.stdout.pipe(ffmpeg.stdin);
				break;
			}
			// Stream from a local file
			case 'local': {
				fs.createReadStream(this.current.url)
					.pipe(ffmpeg.stdin);

				break;
			}
			// Stream from the internet!
			case 'http': {
				request.get(this.current.url)
					.on('response', (res) => {
						if (res.statusCode !== 200) {
							this.message.channel.send('A HTTP error occured. Congratulations!');
						}
					})
					.pipe(ffmpeg.stdin);
				break;
			}
			case 'post': {
				console.dir(this.current.url);
				request.post(this.current.url)
					.pipe(ffmpeg.stdin);

				break;
			}
			default: {
				console.log('Failure: Incorrect audio type');
				this.message.channel.send(`${this.current.type} is not a valid audio provider.`);
				this.play();
			}
			}

			// Send FFMPEG's output to the connection
			console.log('Message: Piping FFMPEG to the connection');
			const dispatcher = this.connection.playStream(ffmpeg.stdout);

			// Check for FFMPEG errors
			ffmpeg.stderr.setEncoding('utf8');
			ffmpeg.stderr.on('data', (data) => {
				if (/^execvp\(\)/.test(data)) {
					console.log('ffmpeg fucked up');
				}
			});

			// The stream has ended, therefore it can go on to the next song
			dispatcher.on('end', () => {
				this.play();
			});
			ffmpeg.on('close', () => {
				console.log('FFMPEG finished');
				this.pid.ffmpeg = null;
			});
		} catch (e) {
			console.log(`Failure: ${e.message}`);
			this.message.channel.send(`${e.message} - Skipping...`);
			this.play();
		}
		return this.play();
	};
	this.add = (type, url, title, thumb) => {
		this.playlist.push({
			type,
			url,
			title,
			thumb
		});

		// If the bot is not playing, enter the channel and start playing
		if (!this.message.member.voiceChannel.connection) {
			this.connect();
		}
	};
	this.skip = () => {
		if (this.pid.ffmpeg) process.kill(this.pid.ffmpeg, 'SIGINT');
		if (this.pid.youtube) process.kill(this.pid.youtube);
		this.pid = {};
	};
	this.stop = () => {
		this.skip();
		this.current = {};
		this.playlist = [];
	};
}

module.exports = Player;

process.on('unhandledRejection', (err) => {
	console.log(`Uncaught Promise Error:\n${err.stack}`);
});

process.on('uncaughtException', (err) => {
	if (err.message !== 'read ECONNRESET') {
		console.log(err.stack);
		return process.exit(1);
	}
	return false;
});
