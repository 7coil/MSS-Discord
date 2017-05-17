const yt = require('ytdl-core');
const streamy = require("stream");
const fs = require('fs');
const request = require("request");

function Player(message) {
	this.message = message;
	this.channel = message.channel;
	this.voicechannel = message.member.voiceChannel;
	this.playlist = [];
	this.pid = null;
	this.stream = new streamy.Writable();
}

//Command to connect to a voicechannel
Player.prototype.stream = function() {
	this.voicechannel
		.join()
		.then(connnection => this.dispatch);
}

//Command to send a stream to the dispatcher
Player.prototype.dispatch = function(connection) {
	var looper = function() {

		//Get a new song playing on the stream
		this.play();

		//Start playing that stream.
		const dispatcher = connnection.playStream(this.stream);

		//When the stream ends, restart the "looper", which gets a new song on the stream
		dispatcher.on('end', () => {
			looper();
		});
	}
	looper();
}

//Command to generate streams for stream()
Player.prototype.play = function() {

	//ffmpeg stuff helped by https://github.com/lperrin/node_airtunes
	//BSD-2-Clause

	//Make an ffmpeg stream
	let ffmpeg = spawn('ffmpeg', [
		'-i', 'pipe:0',
		'-f', 'wav',
		'pipe:1'
	]);

	this.pid = ffmpeg.pid;

	//Send the correct input to the ffmpeg stream
	switch (this.playlist[0].type) {

		//Stream from YouTube
		case "youtube":
			yt(this.playlist[0].url, {audioonly: true})
				.pipe(ffmpeg.stdin);

			break;

		//Stream from a local file
		case "local":
			fs.createReadStream(this.playlist[0].url)
				.pipe(ffmpeg.stdin);

			break;

		//Stream from the internet!
		case "http":
		case "https":
			request(this.playlist[0].url)
				.pipe(ffmpeg.stdin);

			break;
		default:
			this.channel.send(`${this.playlist[0].type} is not a valid audio provider.`);
			this.play();
	}

	this.stream = ffmpeg.stdout;

	ffmpeg.stderr.setEncoding('utf8');
	ffmpeg.stderr.on('data', function(data) {
		if(/^execvp\(\)/.test(data)) {
			console.log('failed to start ' + argv.ffmpeg);
			this.play(message);
		}
	});
}

Player.prototype.add = function(type, url, title, thumb) {
	//Push a JSON string into the array
	this.playlist.push({
		type: type,
		url: url,
		title: title,
		thumb_url: thumb
	});

	//If the bot is not playing, enter the channel and start playing
	if (!this.voicechannel.connection) {
		this.stream();
	}
}