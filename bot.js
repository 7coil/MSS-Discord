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

/*
	Declare variables used in the code
*/

//Version number of MSS-Discord
const version = "2017.02.27b";

//playlist[guild][position in playlist]
var playlist = [];
//current[guild]
var current = [];
//stream[guild]
var stream = [];
//api[keyname]
var api = [];

//Get the Discord API Key.
console.log(process.argv[2]);
if (process.argv[2] && process.argv[3]) {
	api["discord"] = process.argv[2];
	api["youtube"] = process.argv[3];
} else {
	console.log("Usage:\nnode bot.js <Discord API Key> <YouTube API Key>");
	process.exit(1);
}

//Declare the Discord and client constants used to set up the Discord bot
const Discord = require("discord.js");
const client = new Discord.Client();
client.login(api["discord"]);

//ytdl-core for !play
const yt = require('ytdl-core');

//searchYT for searching youtube
var searchYT = require('youtube-node');
var searchYTClient = new searchYT();
searchYTClient.setKey(api["youtube"]);

//fs to open the wav file
const fs = require('fs');

//Set the running game and the avatar for the bot.
client.on('ready', function() {
	console.log("Successfully connected to Discord!");
	client.user.setGame("!!help");
	client.user.setAvatar("http://moustacheminer.com/mss.png");
});

client.on('message', message => {
	try {
		//Split the text into individual command words.
		let input = message.content.replace( /\n/g, " " ).split(" ");
		//The author is a bot, and should not be replied to
		if(message.author.bot) return;
		//Stop commands from being run in DMs
		if (!message.guild) return richSend(message, "Error", "You are not allowed to send commands via Direct Messaging.", "#FF0000");
		
		switch(input[0]) {
			case '!!help':
				message.reply("Sent message via Direct Messaging with details enclosed.");
				message.author.sendMessage("**, also known as Moustacheminer Server Services**\n_Version " + version + "_\n\nCommands\n```//The help command gives a link to the MSS server.\n!!help\n\n//The YouTube command supports either a URL or a search query\n//Will only play over 3600 seconds of media if the user is an admin.\n!!yt <URL>\n!!yt <Search Query>\n\n!!youtube <URL>\n!!youtube <Search Query>\n\n//The skip command skips the currently playing song\n//ADMIN ONLY\n!!skip\n\n//The stop command skips and clears the playlist\n//ADMIN ONLY\n!!stop\n\n//The list command lists the playlist\n!!list\n\n//The error command throws an error\n//ADMIN ONLY\n!!error\n\n//This command executes javascript code in the script\n//OWNER ONLY - CHANGE IF STATEMENT TO YOUR OWN ID IF YOU ARE RUNNING YOUR OWN BOT\n!!eval\n\n//Pastes an invite link into the chat.\n!!invite```\n\nMSS-Discord Discord Server: https://discord.gg/wHgdmf4\nGitHub: https://github.com/moustacheminer/MSS-Discord\nChangelog: https://github.com/moustacheminer/MSS-Discord#changelog");
				break;
			case '!!youtube':
			case '!!yt':
				//Get the voice channel that it's going to play to.
				let voiceChannel = message.member.voiceChannel;
				//Check if the user is inside a voice channel or has inputted anything.
				if (!voiceChannel) {
					reactWith(message, false, "call");
					return false;
				} else if (!input[1]) {
					reactWith(message, false, "link");
					return false;
				}

				searchYTClient.search(message.content.substring(input[0].length + 1), 1, function(error, result) {
					if (error) {
						console.log(error);
						message.reply(error);
						reactWith(message, false, "bomb");
						return false;
					} else {
						yt.getInfo(result["items"][0]["id"]["videoId"], function(err, info) {
							if (!info) {
								reactWith(message, false, "bomb");
								return false;
							}
							if (info["length_seconds"] > 3600 && !isAdmin(message)) return reactWith(message, false, "ruler");
							playlistAdd(message, "youtube", info["video_id"], info["title"], info["thumbnail_url"]);
						});
					}
				});
				break;
			case '!!skip':
				if (!isAdmin(message)) return;
				playlistSkip(message);
				break;
			case '!!stop':
				if (!isAdmin(message)) return;
				playlistClear(message);
				break;
			case '!!list':
				playlistList(message);
				break;
			case '!!error':
				if (!isAdmin(message)) return;
				throw new Error("A error was PURPOSELY thrown for the excitement of mathematicians.");
				break;
			case '!!eval':
				if (message.author.id === "190519304972664832") {
				eval(message.content.substring(6));
				} else {
					//DO NOT ALLOW RANDOMS TO EVAL - SEND X EMOJI ERROR
					reactWith(message, false, "x");
				}
				break;
			case '!!invite':
				message.reply("Invite me into your server!\nhttps://discordapp.com/oauth2/authorize?&client_id=257547382277931009&scope=bot&permissions=70765632");
				break;
			case '!!play':
			case '!!dec':
				message.reply("The " + input[0] + " command has been removed.");
			default:
				reactWith(message, false, "x");
				message.reply("Invalid command supplied. Please send !!help for a list of commands.");
				break;
		}
	} catch(err) {
		fatalSend(message, err)
	}
		
});

//Detect new reactions
client.on('messageReactionAdd', function(messageReaction, user) {
	try {
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
			playlistList(messageReaction.message);
		}
	} catch(err) {
		fatalSend(message, err)
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
	try {
	if (!url) {
		var url = "http://moustacheminer.com/w/mss";
	}
	
	var embed = new Discord.RichEmbed()
		.setTitle(subheading)
		.setAuthor("MSS", 'http://moustacheminer.com/dickbutt.jpg')
		.setColor(colour)
		.setDescription(description)
		.setFooter('moustacheminer.com server services, version ' + version, '')
		.setTimestamp()
		.setURL(url)
		.setImage(img);

	message.channel.sendEmbed(embed, "", { disableEveryone: true });
	} catch(err) {
		fatalSend(message, err);
	}
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
	try {
		if (!thumb_url) {
			thumb_url = "http://i48.tinypic.com/260v86c.png";
		}

		reactWith(message, true);
		playlist[message.guild.id] = playlist[message.guild.id] || [];
		playlist[message.guild.id].push(JSON.stringify({type: type, url: url, title: title, thumb_url: thumb_url}));
		if (!message.member.voiceChannel.connection) {
			playSound(message);
		}
	} catch(err) {
		fatalSend(message, err);
	}
}

/**
 * Function to clear the playlist in a channel.
 * @author: 7coil <admin@moustacheminer.com>
 * @url: http://moustacheminer.com/
 * @param: {Object[]} message
 */
function playlistClear(message) {
	try {
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
	} catch(err) {
		fatalSend(message, err);
	}
}

/**
 * Function to skip the current song in a channel.
 * @author: 7coil <admin@moustacheminer.com>
 * @url: http://moustacheminer.com/
 * @param: {Object[]} message
 */
function playlistSkip(message) {
	try {
	//Get the voice channel that it's going to play to.
	let voiceChannel = message.member.voiceChannel;
	//Check if the user is inside a voice channel
	if (!voiceChannel || !voiceChannel.connection) {
		return richSend(message, "MSS Music Player", "There is no bot running in your current voice channel", "#FF0000");
	}

	message.channel.send("Destroying stream...");
	stream[message.guild.id].destroy();
		} catch(err) {
		fatalSend(message, err);
	}
}

/**
 * Function to start playing through the playlist
 * @author: 7coil <admin@moustacheminer.com>
 * @url: http://moustacheminer.com/
 * @param: {Object[]} message
 */
function playSound(message) {
	try {
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
		} catch(err) {
		fatalSend(message, err);
	}
}

/**
 * Function to start a stream based on what is next on the playlist.
 * @author: 7coil <admin@moustacheminer.com>
 * @url: http://moustacheminer.com/
 * @param: {Object[]} message
 */
function playlistPlay(message) {
	try {
	var voiceChannel = message.member.voiceChannel;
	if (playlist[message.guild.id].length > 0) {
		current[message.guild.id] = JSON.parse(playlist[message.guild.id].shift());
		message.channel.sendMessage('**Music Control Panel**')
			.then(function(message) {
				message.react(String.fromCodePoint(10145));
				message.react(String.fromCodePoint(8505));
				message.react(String.fromCodePoint(128240));
			});
		if (current[message.guild.id]["type"] === "youtube") {
			stream[message.guild.id] = yt(current[message.guild.id]["url"], {audioonly: true});
		} else if (current[message.guild.id]["type"] === "file") {
			stream[message.guild.id] = fs.createReadStream(current[message.guild.id]["url"]);
		}
	} else {
		if (voiceChannel && voiceChannel.connection) voiceChannel.leave();
		playlist[message.guild.id] = [];
		if (stream[message.guild.id]) stream[message.guild.id].destroy();
		richSend(message, "MSS Music Player", "The playlist has ended.", "#00FF00");
		return;
	}
		} catch(err) {
		fatalSend(message, err);
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
			reactWith(message, false, "bomb");
			return false;
		}
	}
}

/**
 * Function to check the playlist for the server the bot is running in.
 * @author: 7coil <admin@moustacheminer.com>
 * @url: http://moustacheminer.com/
 * @param: {Object[]} message
 */
function playlistList(message) {
	try {
		if (playlist[message.guild.id].length > 0) {
			return richSend(message, "MSS Music Player", playlist[message.guild.id].map(function(sound){return JSON.parse(sound).title;}).join("\n"), "#00FF00");
		} else {
			return richSend(message, "MSS Music Player", "There is no music remaining in the playlist.", "#FF0000");
		}
	} catch(err) {
		fatalSend(message, err)
	}
}

/**
 * Function to check if the user is an admin.
 * @author: 7coil <admin@moustacheminer.com>
 * @url: http://moustacheminer.com/
 * @param: {Object[]} message
 * @param: {err} error
 */
function fatalSend(message, err) {
	console.log(err.stack);
	reactWith(message, false, "bomb");
	richSend(message, "This is a Parker Square of an error.", "A fatal error was encountered:\n```\n" + err.stack + "\n```\nA singing banana has been deployed to fix the error. In the meantime, try folding a piece of A4 paper 8 times.", "#FF0000", "http://moustacheminer.com/home/img/ffs.jpg", "https://discord.gg/hPw5gEt");
}

/**
 * Function to check if the user is an admin.
 * @author: 7coil <admin@moustacheminer.com>
 * @url: http://moustacheminer.com/
 * @param: {object{}} message
 * @param: {boolean} success
 * @param: {String} emoji
 */
function reactWith(message, success, type) {
	if (success) {
		message.react(String.fromCodePoint(128077));
		return;
	} else {
		message.react(String.fromCodePoint(128078));
	}
	
	if (type === "link") {
		message.react(String.fromCodePoint(128279));
	} else if (type === "call") {
		message.react(String.fromCodePoint(128222));
	} else if (type === "bomb") {
		message.react(String.fromCodePoint(128163));
	} else if (type === "x") {
		message.react(String.fromCodePoint(10060));
	} else if (type === "ruler") {
		message.react(String.fromCodePoint(128207));
	}
}