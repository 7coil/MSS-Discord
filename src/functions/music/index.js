const config = require("./../../config.json");

//All the music based modules
//ytdl-core for youtube
const yt = require('ytdl-core');
//fs for filesystem files
const fs = require('fs');
//request for web files
const request = require("request");

//ffmpeg for converting potential not wav to wav files so they can be streamed
const ffmpeg = require("fluent-ffmpeg");

//Import all the MSS functions
const MSS = require('./../../functions/');

//Don't forget discord.js
const Discord = require("discord.js");

//This creates a new stream for us
const streamy = require("stream");

//Use exec to manually make ffmpeg processes
const spawn = require("child_process").spawn

//Make all the arrays that will be used
var playlist = [];
var stream = [];
var current = [];
var pid = [];

exports.sound = sound;
exports.play = play;
exports.add = add;
exports.skip = skip;
exports.stop = stop;
exports.get = get;
exports.list = list;
exports.panel = panel;

//The function which inits the stream and connects to Discord
function sound(message) {

	//Get the voicechannel
	var voiceChannel = message.member.voiceChannel;

	//If there is no voicechannel, complain
	if(!voiceChannel) return MSS.msg.react(message, false, "call");

	//Join the voicechannel
	voiceChannel.join()
	.then(connnection => {
		//Declare a function that will be called by itself so the play(message) command will be called when required, instead of all at once.
		var looper = function() {

			//Send the play function which will init the global stream for that channel
			play(message);

			//Start playing that stream.
			const dispatcher = connnection.playStream(stream[message.guild.id]);

			//When the stream ends, restart the "looper", which gets a new song on the stream
			dispatcher.on('end', () => {
				looper();
			});
		}
		looper();
	});
}

//A function to generate the streams from the playlist
function play(message) {

	//Get the voicechannel
	var voiceChannel = message.member.voiceChannel;
	//If there is no voicechannel, complain
	if(!voiceChannel) return MSS.msg.react(message, false, "call");
	//If the stream doesn't exist, make a new stream
	if(!stream[message.guild.id]) { stream[message.guild.id] = new streamy.Writable(); }

	//If we've run out, do the exit procedures
	if (playlist[message.guild.id].length === 0) {
		//Leave the voice channel
		if (voiceChannel && voiceChannel.connection) voiceChannel.leave();

		//Clear the playlist
		playlist[message.guild.id] = [];

		//If there is still a stream (somehow), destroy it
		if (pid[message.guild.id]) {
			process.kill(pid[message.guild.id], 'SIGINT');
			pid[message.guild.id] = null;
		}

		//Goodbye!
		return;
	}

	//Push the currently playing song into the "current" list
	current[message.guild.id] = JSON.parse(playlist[message.guild.id].shift());
	//Send a lovely panel
	panel(message);

	//ffmpeg stuff helped by https://github.com/lperrin/node_airtunes
	//BSD-2-Clause

	//Make an ffmpeg stream
	let ffmpeg = spawn('ffmpeg', [
		'-i', 'pipe:0',
		'-f', 'wav',
		'pipe:1'
	]);

	pid[message.guild.id] = ffmpeg.pid;

	//Send the correct input to the ffmpeg stream
	switch (current[message.guild.id]["type"]) {
		case "youtube":
			yt(current[message.guild.id]["url"], {audioonly: true}).pipe(ffmpeg.stdin);
			break;
		case "local":
			fs.createReadStream(current[message.guild.id]["url"]).pipe(ffmpeg.stdin);
			break;
		case "http":
		case "https":
			request(current[message.guild.id]["url"]).pipe(ffmpeg.stdin);
			break;
		default:
			message.channel.send(`${current[message.guild.id]["type"]} is not a valid audio provider.`);
			play(message);
	}

	stream[message.guild.id] = ffmpeg.stdout;

	ffmpeg.stderr.setEncoding('utf8');
	ffmpeg.stderr.on('data', function(data) {
		if(/^execvp\(\)/.test(data)) {
			console.log('failed to start ' + argv.ffmpeg);
			play(message);
		}
	});
}

//A function to push a new video onto the playlist stack
function add(message, type, url, title, thumb_url) {
	//If there is nothing on the stack, make a new playlist
	playlist[message.guild.id] = playlist[message.guild.id] || [];

	//Push a JSON string into the array
	playlist[message.guild.id].push(JSON.stringify({type: type, url: url, title: title, thumb_url: thumb_url}));

	//If the bot is not playing, enter the channel and start playing
	if (!message.member.voiceChannel.connection) {
		sound(message);
	}
}

//A function to destroy the stream of the currently playing song
function skip(message) {

	//Gets the voicechannel of the currently playing song
	var voiceChannel = message.member.voiceChannel;

	//If there is no bot, complain
	if (!voiceChannel || !voiceChannel.connection) return MSS.msg.react(message, false, "robot");

	if (pid[message.guild.id]) {
		process.kill(pid[message.guild.id], 'SIGINT');
		pid[message.guild.id] = null;
	}

	//Goodbye!
	return;
}

//A function to destroy the stream of the currently playing song, as well as destroying everything in it's path
function stop(message) {

	//Gets the voicechannel of the currently playing song
	var voiceChannel = message.member.voiceChannel;

	//If there is no bot, complain
	if (!voiceChannel || !voiceChannel.connection) return MSS.msg.react(message, false, "robot");

	if (pid[message.guild.id]) {
		process.kill(pid[message.guild.id], 'SIGINT');
		pid[message.guild.id] = null;
	}

	//Destroy the currently playing song, the playlist and the stream
	current[message.guild.id] = [];
	playlist[message.guild.id] = [];

	//Goodbye!
	return;
}

//A function to post a list of the songs in the playlist
function list(message) {

	//Complain if it's a DM
	if(!message.guild) return message.reply("You cannot use this command in a DM");

	//There is nothing currently in the playlist
	if(!current[message.guild.id]) return MSS.msg.rich(message, "MSS Music Player", "There is no music currently playing.", "#FF0000");

	//If there is no playlist, or if there's no more in the list, complain
	if (!playlist[message.guild.id] || playlist[message.guild.id].length < 1) return MSS.msg.rich(message, "MSS Music Player", "There is no music remaining in the playlist.", "#FF0000");

	//Send a list of the playlist
	MSS.msg.rich(message, "MSS Music Player", playlist[message.guild.id].map(function(sound){return JSON.parse(sound).title;}).join("\n"), "#00FF00");

	//Goodbye!
	return;
}

//A function to get the currently playing song
function get(message) {
	//Complain if it's a DM
	if(!message.guild) return message.reply("You cannot use this command in a DM");
	
	//There is nothing currently in the playlist
	if(!current[message.guild.id]) return MSS.msg.rich(message, "MSS Music Player", "There is no music currently playing.", "#FF0000");

	//Send a fancy embed with images and shit
	var embed = new Discord.RichEmbed()
		.setTitle("MSS Music Player")
		.setAuthor("MSS", "http://moustacheminer.com/mss.png")
		.setColor("#00FF00")
		.setDescription("Now playing: " + current[message.guild.id]["title"])
		.setFooter("MSS-Discord, " + config.MSS.version, "")
		.setTimestamp()
		.setURL(current[message.guild.id]["url"])
		.setImage(current[message.guild.id]["thumb_url"]);

	//Send that embed. Hurray.
	message.channel.sendEmbed(embed, "", { disableEveryone: true });
}

//A function to send a simple control panel.
function panel(message) {
	//Complain if it's a DM
	if(!message.guild) return message.reply("You cannot use this command in a DM");

	//There is nothing currently in the playlist
	if(!current[message.guild.id]) return MSS.msg.rich(message, "MSS Music Player", "There is no music currently playing.", "#FF0000");

	message.channel.send('**Music Control Panel**')
	.then(function(message) {
		message.react(String.fromCodePoint(10145));
		message.react(String.fromCodePoint(8505));
		message.react(String.fromCodePoint(128240));
	});
}

process.on("unhandledRejection", function(err) {
  console.error("Uncaught Promise Error: \n" + err.stack);
});
