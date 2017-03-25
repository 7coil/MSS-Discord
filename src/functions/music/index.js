const config = require("./../../config.json");
const yt = require('ytdl-core');
const fs = require('fs');
const msg = require('./../msg/');
const Discord = require("discord.js");
const request = require("request");

var playlist = [];
var stream = [];
var current = [];

exports.sound = sound;
exports.play = play;
exports.add = add;
exports.skip = skip;
exports.stop = stop;
exports.get = get;
exports.list = list;

//A function to keep playing that stream
function sound(message) {
	var voiceChannel = message.member.voiceChannel;

	voiceChannel.join()
	.then(connnection => {
		//Declare a function that will be called by itself so the play(message) command will be called when required, instead of all at once.
		var looper = function() {
			play(message);
			const dispatcher = connnection.playStream(stream[message.guild.id]);
			dispatcher.on('end', () => {
				looper();
			});
		}
		looper();
	});
}

//A function to generate the streams from the playlist
function play(message) {
	var voiceChannel = message.member.voiceChannel;
	
	if(!voiceChannel) {
		//Not in voice
		return MSS.msg.react(message, false, "call");
	}
	
	if (playlist[message.guild.id].length > 0) {
		current[message.guild.id] = JSON.parse(playlist[message.guild.id].shift());
		message.channel.sendMessage('**Music Control Panel**')
			.then(function(message) {
				message.react(String.fromCodePoint(10145));
				message.react(String.fromCodePoint(8505));
				message.react(String.fromCodePoint(128240));
			});
		switch (current[message.guild.id]["type"]) {
			case "youtube":
				stream[message.guild.id] = yt(current[message.guild.id]["url"], {audioonly: true});
				break;
			case "local":
				stream[message.guild.id] = fs.createReadStream(current[message.guild.id]["url"]);
				break;
			case "http":
			case "https":
				request(current[message.guild.id]["url"]).pipe(stream[message.guild.id]);
				break;


		}
	} else {
		if (voiceChannel && voiceChannel.connection) voiceChannel.leave();
		playlist[message.guild.id] = [];
		if (stream[message.guild.id]) stream[message.guild.id].destroy();
		return;
	}
}

//A function to push a new video onto the playlist stack
function add(message, type, url, title, thumb_url) {
	playlist[message.guild.id] = playlist[message.guild.id] || [];
	playlist[message.guild.id].push(JSON.stringify({type: type, url: url, title: title, thumb_url: thumb_url}));
	if (!message.member.voiceChannel.connection) {
		sound(message);
	}
}

function skip(message) {
	message.channel.send("Destroying stream...");
	stream[message.guild.id].destroy();
}

function stop(message) {
	playlist[message.guild.id] = [];
	skip(message);
}

function list(message) {
	if (playlist[message.guild.id].length > 0) {
		return msg.rich(message, "MSS Music Player", playlist[message.guild.id].map(function(sound){return JSON.parse(sound).title;}).join("\n"), "#00FF00");
	} else {
		return msg.rich(message, "MSS Music Player", "There is no music remaining in the playlist.", "#FF0000");
	}
}

function get(message) {
	var embed = new Discord.RichEmbed()
		.setTitle("MSS Music Player")
		.setAuthor("MSS", "http://moustacheminer.com/mss.png")
		.setColor("#00FF00")
		.setDescription("Now playing: " + current[message.guild.id]["title"])
		.setFooter("MSS-Discord, " + config.MSS.version, "")
		.setTimestamp()
		.setURL(current[message.guild.id]["url"])
		.setImage(current[message.guild.id]["thumb_url"]);

	message.channel.sendEmbed(embed, "", { disableEveryone: true });
}
