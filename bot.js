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

//Declare the playlist
var playlist = [];

//Set the running game and the avatar for the bot.
client.on('ready', function() {
	console.log("Successfully connected to Discord!");
	client.user.setGame("ask for >>   !help");
	client.user.setAvatar("http://moustacheminer.com/dickbutt.jpg");
});

client.on('message', message => {
	
	try {
		//Stop checking if the message is from a bot - Don't repeat the !ping Pong!
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
			if (!voiceChannel) {
				return richSend(message, input[0], "Please be in a voice channel before using the " + input[0] + " command", "#FFFF00");
			}
			
			if (youtubeCheck(input[1])) {
				yt.getInfo(input[1], function(err, info) {
					if (!info) {
						return richSend(message, "!play", "Please send a valid YouTube URL", "#FF0000");
					}
					
					playlistAdd(message, "youtube", input[1], info["title"], info["thumbnail_url"]);
				});
				
			} else {
				console.log(input[1]);
			}
		} else if (input[0] === '!stop') {
			playlistClear(message);
		} else if (input[0].toLowerCase().split('').filter(function(item, i, ar){ return ar.indexOf(item) === i; }).join('') === "cirletn"){
			//Remove all repeated characters and check if it matches 'cirletn'
			return richSend(message, "Circletine", "CCCCCCCCCCCIIIIIIIIIIIIIIIIIRRRRRRRRRRRRRRRRRRRRRRRRCCCCCCCCCCCCCCCCCCCCCCLLLLLLLLLLLLLLLLLLEEEEEEEEEEEEEEETTTTTTTTTTTTTTTTTTIIIIIIIIIIIIIINNNNNNNNNNNNNNEEEEEEEEEEE", "#FFFFFF");
		} else if (message.content === 'sexual tension') {
			//Send a fancy image.
			return richSend(message, "sexual tension", "sexual tension", "#FF9999", "http://moustacheminer.com/download/sexualtension2.png");
		} else if (input[0] === '!dec') {
			let dec = message.content.substring(5);
			//Get the voice channel that it's going to play to.
			let voiceChannel = message.member.voiceChannel;
			
			//Check if the user is inside a voice channel
			if (!voiceChannel) {
				return richSend(message, "!dec", "Please be in a voice channel before using the !dec command", "#FFFF00");
			}
			
			var file = Math.floor(Math.random() * 9999);
			child_process.execFile('say', ['-w', 'C:\\MOUSTACHEMINER\\NodeJS\\MSS-Discord\\DEC\\' + file + '.wav', dec]);
			playlistAdd(message, "file", 'C:\\MOUSTACHEMINER\\NodeJS\\MSS-Discord\\DEC\\' + file + '.wav', "DecTalk Input");
		}
	} catch(err) {
		//Catch those errors!
		richSend(message, "Fatal error encountered.", err.stack + "\n\nPlease send a screenshot to the MSS Discord Server.\nhttps://discord.gg/ZW7GGGH", "#FF0000", "", "https://discord.gg/ZW7GGGH");
	}
		
});

//Provide an easy wrapper for Discord and Discord API's and Discord.js' RichEmbed feature
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

function playlistAdd(message, type, url, title, thumb_url) {
	if (!thumb_url) {
		thumb_url = "http://i48.tinypic.com/260v86c.png";
	}
	
	richSend(message, "!play", "Added " + title + " to playlist", "#00FF00");
	playlist[message.guild] = playlist[message.guild] || [];
	playlist[message.guild].push(JSON.stringify({type: type, url: url, title: title, thumb_url: thumb_url}));
	if (!message.member.voiceChannel.connection) {
		playSound(message);
	}
}

function playlistClear(message) {
	//Check if the person has permission to stop the music
	if (!(message.channel.permissionsFor(message.member).hasPermission("ADMINISTRATOR") || message.author.id === "190519304972664832")) {
		return richSend(message, "!stop", "You do not have permission to stop the bot.", "#FF0000");
	}

	//Get the voice channel
	let voiceChannel = message.member.voiceChannel;

	//If the person is in the voice channel, stop the bot in that channel
	if (voiceChannel && voiceChannel.connection) {
		richSend(message, "!stop", "Stopped playing music in the channel.", "#00FF00");
		return voiceChannel.leave();
		playlist[message.guild] = [];
	} else {
		return richSend(message, "!stop", "There is no bot running in your current voice channel", "#FF0000");
	}
}

function playSound(message) {
	var voiceChannel = message.member.voiceChannel;
	var current;
	var stream;
	
	voiceChannel.join()
	.then(connnection => {
		var looper = function() {
			if (playlist[message.guild].length > 0) {
				current = JSON.parse(playlist[message.guild].shift());
				richSend(message, "Now playing:", current["title"], "#00FF00", current["thumb_url"], current["url"]);

				if (current["type"] === "youtube") {
					stream = yt(current["url"], {audioonly: true});
				} else if (current["type"] === "file") {
					stream = fs.createReadStream(current["url"])
				}
				const dispatcher = connnection.playStream(stream);
				dispatcher.on('end', () => {
					looper();
				});
			} else {
				voiceChannel.leave();
				return;
			}
		}
		looper();
	});
}

/**
 * JavaScript function to match (and return) the video Id 
 * of any valid Youtube Url, given as input string.
 * @author: Stephan Schmitz <eyecatchup@gmail.com>
 * @url: http://stackoverflow.com/a/10315969/624466
 */
function youtubeCheck(url) {
  var p = /^(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/;
  return (url.match(p)) ? RegExp.$1 : false;
}
