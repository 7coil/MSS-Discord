const config = require("./../../config.json");
const yt = require('ytdl-core');
const fs = require('fs');
const MSS = require('./../../functions/');
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
		reply = {
			response: {
				name: "XML-Music",
				to: message.author.username,
				error: true,
				output: "There is no bot in the channel."
			}
		}

		MSS.msg.xml(message, reply);

		return false;
	}
	
	if (playlist[message.guild.id].length > 0) {
		current[message.guild.id] = JSON.parse(playlist[message.guild.id].shift());

		switch (current[message.guild.id]["type"]) {
			case "youtube":
				stream[message.guild.id] = yt(current[message.guild.id]["url"], {audioonly: true});
				break;
			case "local":
				stream[message.guild.id] = fs.createReadStream(current[message.guild.id]["url"]);
				break;
			case "http":
			case "https":
				request(current[message.guild.id]["url"])
					.pipe(stream[message.guild.id])
					.on('close', function() {
						console.log("HTTP(s) Stream ended");
					});
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
	var voiceChannel = message.member.voiceChannel;
	if (!voiceChannel || !voiceChannel.connection) {
		reply = {
			response: {
				name: "XML-Music",
				to: message.author.username,
				error: true,
				output: "There is no bot in the channel."
			}
		}

		MSS.msg.xml(message, reply);

		return false;
	}
	reply = {
		response: {
			name: "XML-Music",
			to: message.author.username,
			error: false,
			output: "Destroying stream..."
		}
	}

	MSS.msg.xml(message, reply);

	stream[message.guild.id].destroy();
}

function stop(message) {
	var voiceChannel = message.member.voiceChannel;
	if (!voiceChannel || !voiceChannel.connection) {
		//No bot in channel
		reply = {
			response: {
				name: "XML-Music",
				to: message.author.username,
				error: true,
				output: "There is no bot in the channel."
			}
		}

		MSS.msg.xml(message, reply);

		return false;
	}

	if (voiceChannel && voiceChannel.connection) voiceChannel.leave();
	current[message.guild.id] = [];
	playlist[message.guild.id] = [];
	if (stream[message.guild.id]) stream[message.guild.id].destroy();
	return;
}

function list(message) {
	//Check if it does not exist, or has less than 1 item remaining.
	if (!playlist[message.guild.id] || playlist[message.guild.id].length < 1) {
		reply = {
			response: {
				name: "XML-Music",
				to: message.author.username,
				error: false
				output: "There are no more songs in the playlist"
			}
		}

		MSS.msg.xml(message, reply);
	} else {
		reply = {
			response: {
				name: "XML-Music",
				to: message.author.username,
				error: false,
				output: {
					playlist: {
						song: playlist[message.guild.id].map(function(sound){return JSON.parse(sound).title;})
					}
				}
			}
		}

		MSS.msg.xml(message, reply);
		return false;
	}
}

function get(message) {
	if(!current[message.guild.id]) {
		reply = {
			response: {
				name: "XML-Music",
				to: message.author.username,
				error: true,
				output: "You do not have permission to stop."
			}
		}

		MSS.msg.xml(message, reply);

		return false;
	}

	reply = {
		response: {
			name: "XML-Music",
			to: message.author.username,
			error: true,
			output: {
				title: current[message.guild.id]["title"],
				url: current[message.guild.id]["url"],
				thumb: current[message.guild.id]["thumb_url"]
			}
		}
	}

	MSS.msg.xml(message, reply);

	return false;
}
