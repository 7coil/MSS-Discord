/*
	MSS-Discord
	Copyright (C) 2017 moustacheminer.com

	This program is free software: you can redistribute it and/or modify
	it under the terms of the GNU General Public License as published by
	the Free Software Foundation, either version 3 of the License, or
	(at your option) any later version.

	This program is distributed in the hope that it will be useful,
	but WITHOUT ANY WARRANTY; without even the implied warranty of
	MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
	GNU General Public License for more details.

	You should have received a copy of the GNU General Public License
	along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

//Get the Discord API Key.
console.log(process.argv[2]);
if (process.argv[2]) {
	var api = process.argv[2];
} else {
	console.log("Usage:\nnode bot.js <Discord API Key>");
	process.exit(1);
}

//Declare the Discord and client constants used to set up the Discord bot
const Discord = require("discord.js");
const client = new Discord.Client();

//ytdl-core for !play
const yt = require('ytdl-core');

//fs to open the wav file
const fs = require('fs');

//exec for the DECtalk API
const child_process = require('child_process');

//Login to Discord's Bot API Service
client.login(api);

//Declare the playlist and stream variables
//playlist[guild][position in playlist]
var playlist = [];
//current[guild]
var current = [];
//stream[guild]
var stream = [];

//Set the running game and the avatar for the bot.
client.on('ready', function() {
	console.log("Successfully connected to Discord!");
	client.user.setGame("ask for >>   !help");
	client.user.setAvatar("http://moustacheminer.com/dickbutt.jpg");
});

client.on('message', message => {
	
	try {
		
		if(message.author.id === "81026656365453312" && message.content.startsWith("Pong!")) {
			setTimeout(function(){
				return message.channel.send("!ping");
			}, 1000);
		}
		if(message.author.bot) return;
		
		let input = message.content.replace( /\n/g, " " ).split(" ");
		
		//Set the username of the bot as MSS
		if (message.guild) {
			message.guild.member(client.user).setNickname('MSS');
		} else {
			//If the bot is not in the server, stop doing shit - It's too dangerous.
			return richSend(message, "Error", "You are not allowed to send commands via Direct Messaging.", "#FF0000");
		}

		//Send help detials. Need to use the E-zed richSend someday
		if (input[0] === '!help') {
			richSend(message, "Moustacheminer Server Services", "Help is at hand, at the official MSS Discord Server @ https://discord.gg/hPw5gEt", "#FF9999", "http://i.imgur.com/h2JkYGm.jpg", "https://discord.gg/hPw5gEt");
		} else if (input[0] === '!play') {
			//Get the voice channel that it's going to play to.
			let voiceChannel = message.member.voiceChannel;
			//Check if the user is inside a voice channel
			if (!voiceChannel) return richSend(message, "MSS Music Player", "Please be in a voice channel before using the " + input[0] + " command", "#FFFF00");
			if (!input[1]) return richSend(message, "MSS Music Player", "Please insert a VALID url.", "#FF0000");
			
			if (youtubeCheck(input[1])) {
				yt.getInfo(input[1], function(err, info) {
					if (!info) return richSend(message, "MSS Music Player", "Please send a valid YouTube URL", "#FF0000");
					if (info["length_seconds"] > 3600 && !isAdmin(message)) return;
					playlistAdd(message, "youtube", input[1], info["title"], info["thumbnail_url"]);
				});
			} else {
				console.log(input[1]);
				richSend(message, "MSS Music Player", "The URL is currently NOT supported by Moustacheminer Server Services.", "#FF0000");
			}
		} else if (input[0] === '!skip') {
			if (!isAdmin(message)) return;
			playlistSkip()
		} else if (input[0] === '!stop') {
			if (!isAdmin(message)) return;
			playlistClear(message);
		} else if (input[0] === '!dec') {
			let dec = message.content.substring(5).replace("\n", " ");
			//Get the voice channel that it's going to play to.
			let voiceChannel = message.member.voiceChannel;
			
			//Check if the user is inside a voice channel
			if (!voiceChannel) {
				return richSend(message, "MSS Music Player", "Please be in a voice channel before using the !dec command", "#FFFF00");
			}
			
			var file = Math.floor(Math.random() * 9999);
			child_process.execFile('say', ['-w', 'C:\\MOUSTACHEMINER\\NodeJS\\MSS-Discord\\DEC\\' + file + '.wav', dec]);
			setTimeout(function(){
				playlistAdd(message, "file", 'C:\\MOUSTACHEMINER\\NodeJS\\MSS-Discord\\DEC\\' + file + '.wav', "DecTalk Input");
			}, 2000);
			
		} else if (input[0] === '!list') {
			if (playlist[message.guild.id].length > 0) {
				return richSend(message, "MSS Music Player", playlist[message.guild.id].map(function(sound){return JSON.parse(sound).title;}).join("\n"), "#00FF00");
			} else {
				return richSend(message, "MSS Music Player", "There is no music remaining in the playlist.", "#FF0000");
			}
		} else if (input[0] === '!error') {
			if (!isAdmin(message)) return;
			throw new Error("A error was PURPOSELY thrown for the excitement of mathematicians.");
		} else if (input[0] === '!eval') {
			if (message.author.id === "190519304972664832") {
				eval(message.content.substring(6));
			} else {
				richSend(message, "!eval", "You do not have permission to run this command.", "#FF0000", "http://i.imgur.com/Uz6Xq1v.png");
			}
		} else if (input[0] === '!invite') {
			message.reply("Invite me into your server!\nhttps://discordapp.com/oauth2/authorize?&client_id=257547382277931009&scope=bot&permissions=0");
		}
	} catch(err) {
		console.log(err.stack);
		//Catch those errors!
		richSend(message, "This is a Parker Square of an error.", "A fatal error was encountered:\n```\n" + err.stack + "\n```\nA singing banana has been deployed to fix the error. In the meantime, try folding a piece of A4 paper 8 times.", "#FF0000", "http://moustacheminer.com/home/img/ffs.jpg", "https://discord.gg/hPw5gEt");
	}
		
});

//Detect new reactions
client.on('messageReactionAdd', function(messageReaction, user) {

	//Only on it's own messages
	if(!(messageReaction.message.author.id === client.user.id)) return;
	//Prevent other bots (as well as itself) from using the reaction media controls
    if (user.bot) return;
	//Get the UTF-16 code for the string (reaction)
	var input = messageReaction.emoji.name.codePointAt();
	
	//Log the code.
	console.log(input);
	
	//Delete the reaction
	messageReaction.remove(user);
	
	if (input === 10145) {
		if (!isAdmin(user, messageReaction.message.channel)) return;
		playlistSkip(messageReaction.message);
	} else if (input === 8505) {
		richSend(messageReaction.message, "Now playing:", current[messageReaction.message.guild.id]["title"], "#00FF00", current[messageReaction.message.guild.id]["thumb_url"], current[messageReaction.message.guild.id]["url"]);
	} else if (input === 128240) {
		return richSend(messageReaction.message, "MSS Music Player", playlist[messageReaction.message.guild.id].map(function(sound){return JSON.parse(sound).title;}).join("\n"), "#00FF00");
	}

});

/**
 * Function to send a rich embed to the server the message was sent by.
 * @author: 7coil <admin@moustacheminer.com>
 * @url: http://moustacheminer.com/
 * @param: {Object[]} message
 * @param: {string} subheading
 * @param: {string} description
 * @param: {string} colour
 * @param: {string} img
 * @param: {string} url
 */
function richSend(message, subheading, description, colour, img, url) {
	if (!url) {
		var url = "http://moustacheminer.com/w/mss";
	}
	
	var embed = new Discord.RichEmbed()
		.setTitle(subheading)
		.setAuthor("MSS", 'http://moustacheminer.com/dickbutt.jpg')
		.setColor(colour)
		.setDescription(description)
		.setFooter('moustacheminer.com server services', '')
		.setTimestamp()
		.setURL(url)
		.setImage(img);

	message.channel.sendEmbed(embed, "", { disableEveryone: true });
}

/**
 * Function to add things into the playlist, and play it if it needs to.
 * @author: 7coil <admin@moustacheminer.com>
 * @url: http://moustacheminer.com/
 * @param: {Object[]} message
 * @param: {string} type
 * @param: {string} url
 * @param: {string} title
 * @param: {string} thumb_url
 */
function playlistAdd(message, type, url, title, thumb_url) {
	if (!thumb_url) {
		thumb_url = "http://i48.tinypic.com/260v86c.png";
	}
	
	message.react(String.fromCodePoint(128077));
	playlist[message.guild.id] = playlist[message.guild.id] || [];
	playlist[message.guild.id].push(JSON.stringify({type: type, url: url, title: title, thumb_url: thumb_url}));
	if (!message.member.voiceChannel.connection) {
		playSound(message);
	}
}

/**
 * Function to clear the playlist in a channel.
 * @author: 7coil <admin@moustacheminer.com>
 * @url: http://moustacheminer.com/
 * @param: {Object[]} message
 */
function playlistClear(message) {
	//Get the voice channel
	let voiceChannel = message.member.voiceChannel;

	//If the person is in the voice channel, stop the bot in that channel
	if (voiceChannel && voiceChannel.connection) {
		voiceChannel.leave();
		playlist[message.guild.id] = [];
		stream[message.guild.id].destroy();
		return;
	} else {
		return richSend(message, "MSS Music Player", "There is no bot running in your current voice channel", "#FF0000");
	}
}

/**
 * Function to skip the current song in a channel.
 * @author: 7coil <admin@moustacheminer.com>
 * @url: http://moustacheminer.com/
 * @param: {Object[]} message
 */
function playlistSkip(message) {
	//Get the voice channel that it's going to play to.
	let voiceChannel = message.member.voiceChannel;
	//Check if the user is inside a voice channel
	if (!voiceChannel.connection) {
		return richSend(message, "MSS Music Player", "There is no bot running in your current voice channel", "#FF0000");
	}

	message.channel.send("Destroying stream...");
	stream[message.guild.id].destroy();
}

/**
 * Function to start playing through the playlist
 * @author: 7coil <admin@moustacheminer.com>
 * @url: http://moustacheminer.com/
 * @param: {Object[]} message
 */
function playSound(message) {
	var voiceChannel = message.member.voiceChannel;
	var current;
	
	voiceChannel.join()
	.then(connnection => {
		var looper = function() {
			playlistPlay(message);
			const dispatcher = connnection.playStream(stream[message.guild.id]);
			dispatcher.on('end', () => {
				looper();
			});
		}
		looper();
	});
}

/**
 * Function to start a stream based on what is next on the playlist.
 * @author: 7coil <admin@moustacheminer.com>
 * @url: http://moustacheminer.com/
 * @param: {Object[]} message
 */
function playlistPlay(message) {
	var voiceChannel = message.member.voiceChannel;
	if (playlist[message.guild.id].length > 0) {
		current[message.guild.id] = JSON.parse(playlist[message.guild.id].shift());
		message.channel.sendMessage('**Music Control Panel (beta)**')
			.then(function(message) {
				setTimeout(function(){
					message.react(String.fromCodePoint(10145));
				}, 500);
				setTimeout(function(){
					message.react(String.fromCodePoint(8505));
				}, 1000);
				setTimeout(function(){
					message.react(String.fromCodePoint(128240));
				}, 1500);
			});
		if (current[message.guild.id]["type"] === "youtube") {
			stream[message.guild.id] = yt(current[message.guild.id]["url"], {audioonly: true});
		} else if (current[message.guild.id]["type"] === "file") {
			stream[message.guild.id] = fs.createReadStream(current[message.guild.id]["url"]);
		}
	} else {
		if (voiceChannel.connection) voiceChannel.leave();
		playlist[message.guild.id] = [];
		if (stream[message.guild.id]) stream[message.guild.id].destroy();
		richSend(message, "MSS Music Player", "The playlist has ended.", "#00FF00");
		return;
	}
}

/**
 * JavaScript function to match (and return) the video Id of any valid Youtube Url, given as input string.
 * @author: Stephan Schmitz <eyecatchup@gmail.com>
 * @url: http://stackoverflow.com/a/10315969/624466
 * @param: {string} url
 * @return: {Boolean} isYouTube
 */
function youtubeCheck(url) {
	if (url.startsWith("https://m.youtube.com/watch?v=")) return true;
	
  	var p = /^(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/;
  	return (url.match(p)) ? RegExp.$1 : false;
}

/**
 * Function to check if the user is an admin.
 * @author: 7coil <admin@moustacheminer.com>
 * @url: http://moustacheminer.com/
 * @param: {Object[]} message
 * @return {Boolean} isAdmin
 */
function isAdmin(input, channel) {
	if (channel) {
		if (channel.permissionsFor(input).hasPermission("ADMINISTRATOR") || input.id === "190519304972664832") {
			return true;
		} else {
			return false;
		}
	} else {
		if (input.channel.permissionsFor(input.member).hasPermission("ADMINISTRATOR") || input.author.id === "190519304972664832") {
			return true;
		} else {
			richSend(message, "!stop", "You do not have permission to run this command.", "#FF0000");
			return false;
		}
	}
}