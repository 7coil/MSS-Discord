const yt = require('ytdl-core');
const streamy = require("stream");
const fs = require('fs');
const request = require("request");
const spawn = require("child_process").spawn

module.exports = Player;

function Player(message) {
	var that = this;

	this.message = message;
	this.channel = message.channel;
	this.voicechannel = message.member.voiceChannel;
	this.playlist = [];
	this.current = {};
	this.pid = null;
	this.stream = new streamy.Writable();

	this.connect = function() {
		this.voicechannel
			.join()
			.then(connection => {
				var looper = function() {

					//Get a new song playing on the stream
					that.play();
					console.dir(that.playlist);

					//Start playing that stream.
					const dispatcher = connection.playStream(that.stream);

					//When the stream ends, restart the "looper", which gets a new song on the stream
					dispatcher.on('end', () => {
						looper();
					});
				}
				looper();
			});
	}

	this.play = function() {
		this.current = this.playlist.shift();
		if(typeof this.current == "undefined") return this.stop();

		//Make an ffmpeg stream
		let ffmpeg = spawn('ffmpeg', [
			'-i', 'pipe:0',
			'-f', 'wav',
			'pipe:1'
		]);

		this.pid = ffmpeg.pid;

		//Send the correct input to the ffmpeg stream
		switch (this.current.type) {

			//Stream from YouTube
			case "youtube":
				yt(this.current.url, {audioonly: true})
					.pipe(ffmpeg.stdin);

				break;

			//Stream from a local file
			case "local":
				fs.createReadStream(this.current.url)
					.pipe(ffmpeg.stdin);

				break;

			//Stream from the internet!
			case "http":
			case "https":
				request(this.current.url)
					.pipe(ffmpeg.stdin);

				break;
			default:
				this.channel.send(`${this.current.type} is not a valid audio provider.`);
				this.play();
		}

		this.stream = ffmpeg.stdout;

		ffmpeg.stderr.setEncoding('utf8');
		ffmpeg.stderr.on('data', function(data) {
			if(/^execvp\(\)/.test(data)) {
				console.log('failed to start ' + argv.ffmpeg);
				that.play();
			}
		});
	}

	this.add = function(type, url, title, thumb) {
		//Push a JSON string into the array
		this.playlist.push({
			type: type,
			url: url,
			title: title,
			thumb_url: thumb
		});

		//If the bot is not playing, enter the channel and start playing
		if (!this.voicechannel.connection) {
			this.connect();
		}
	}

	this.skip = function() {
		if (this.pid) process.kill(this.pid, "SIGINT");
		this.pid = null;
		this.stream.destroy();
	}

	this.stop = function() {
		this.playlist = []
		this.skip();
		if (this.voicechannel && this.voicechannel.connection) this.voicechannel.leave();
	}
}

process.on("unhandledRejection", function(err) {
	console.error("Uncaught Promise Error: \n" + err.stack);
});

process.on("uncaughtException", function(err) {
	console.error("Uncaught Exception Error: \n" + err.stack);
});
