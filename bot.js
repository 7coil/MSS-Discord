// install ytdl-core before running this!
// npm install --save ytdl-core
const Discord = require("discord.js");
const feed = require("feed-read");
const yt = require('ytdl-core');
const client = new Discord.Client();
const fs = require('fs');
client.login("");

client.on('ready', function() {
	client.user.setGame("ask for >>   !help");
	client.user.setAvatar("http://moustacheminer.com/dickbutt.jpg");
});

client.on('message', message => {
	
	try {
		if(message.author.bot) return;
		
		let input = message.content.replace( /\n/g, " " ).split(" ");
		if (message.guild) {
			message.guild.member(client.user).setNickname('MSS');
		}

		if (input[0] === '!help') {
			var embed = new Discord.RichEmbed()
				.setTitle('Help')
				.setAuthor('MSS', 'http://moustacheminer.com/dickbutt.jpg')
				.setColor("#00AE86")
				.setDescription('Help can be found at our wiki page, or at the moustacheminer server services Discord server.')
				.setFooter('moustacheminer.com server services', '')
				.setTimestamp()
				.setURL('http://moustacheminer.com/w/mss')
				.addField('Wiki', 'http://moustacheminer.com/w/mss')
				.addField('MSS Discord Invite', 'https://discordapp.com/oauth2/authorize?client_id=257547382277931009&permissions=0&scope=bot')
				.addField('MSS Discord Discord Server', 'https://discord.gg/hPw5gEt')
				.addField('GitHub', 'https://github.com/moustacheminer/MSS-Discord')
				.addField('GNU GPLv3', "MSS-Discord\nCopyright (C) 2017 moustacheminer.com\n\nThis program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.\n\nThis program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.\n\nYou should have received a copy of the GNU General Public License along with this program.\n\nIf not, see <http://www.gnu.org/licenses/>.");

			return message.channel.sendEmbed(embed, "", { disableEveryone: true });
		}
		
		if (input[0] === '!play') {
			let voiceChannel = message.member.voiceChannel;
			if (!voiceChannel) {
				return richSend(message, "!play", "Please be in a voice channel before using the !play command", "#FFFF00");
			}
			
			if (!youtubeCheck(input[1])) {
				return richSend(message, "!play", "Please send a valid YouTube URL", "#FFFF00");
			}
			
			yt.getInfo(input[1], function(err, info) {
				if (!info) {
					return richSend(message, "!play", "Please send a valid YouTube URL", "#FF0000");
				}
				
				if (info["length_seconds"] > 3600 && !(message.channel.permissionsFor(message.member).hasPermission("ADMINISTRATOR") || message.author.id === "190519304972664832")) {
					return richSend(message, "!play", "The duration of this video exceedes 1 hour.", "#FF0000");
				}
				
				richSend(message, "Now playing:", info["title"], "#00FF00", info["thumbnail_url"], "https://youtube.com/watch?v=" + info["video_id"]);
				
				voiceChannel.join()
				.then(connnection => {
					input[1] = input[1].replace(/%/g, "");
					let stream = yt(input[1], {audioonly: true});
					const dispatcher = connnection.playStream(stream);
					dispatcher.on('end', () => {
						voiceChannel.leave();
					});
				});
			});

		}
		
		if (input[0] === '!stop') {
			if (!(message.channel.permissionsFor(message.member).hasPermission("ADMINISTRATOR") || message.author.id === "190519304972664832")) {
				return richSend(message, "!stop", "You do not have permission to stop the bot.", "#FF0000");
			}
			let voiceChannel = message.member.voiceChannel;
			if (voiceChannel) {
				richSend(message, "!stop", "Stopped playing music in the channel.", "#00FF00");
				return voiceChannel.leave();
			} else {
				return richSend(message, "!stop", "There is no bot running.", "#FF0000");
			}
		}

		if(input[0].toLowerCase().split('').filter(function(item, i, ar){ return ar.indexOf(item) === i; }).join('') === "cirletn"){
			return richSend(message, "Circletine", "CCCCCCCCCCCIIIIIIIIIIIIIIIIIRRRRRRRRRRRRRRRRRRRRRRRRCCCCCCCCCCCCCCCCCCCCCCLLLLLLLLLLLLLLLLLLEEEEEEEEEEEEEEETTTTTTTTTTTTTTTTTTIIIIIIIIIIIIIINNNNNNNNNNNNNNEEEEEEEEEEE", "#FFFFFF");
		}
		
		if(message.content === 'sexual tension') {
			return richSend(message, "sexual tension", "sexual tension", "#FF9999", "http://moustacheminer.com/download/sexualtension2.png");
		}
		
		var flips = ['┻', '╩', '┫', '┣', '︵', '╰', '╯', 'ノ']
		for (var i = 0; i < message.content.length; i++ ) {
			if (flips.indexOf(message.content.charAt(i)) > -1) {
				return message.channel.sendMessage("┬─┬﻿ ノ( ゜-゜ノ)");
			}
		}
	} catch(err) {
		richSend(message, "Fatal error encountered.", err.stack + "\n\nPlease send a screenshot to the MSS Discord Server.\nhttps://discord.gg/ZW7GGGH", "#FF0000", "", "https://discord.gg/ZW7GGGH");
	}
		
});

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
 * JavaScript function to match (and return) the video Id 
 * of any valid Youtube Url, given as input string.
 * @author: Stephan Schmitz <eyecatchup@gmail.com>
 * @url: http://stackoverflow.com/a/10315969/624466
 */
function youtubeCheck(url) {
  var p = /^(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/;
  return (url.match(p)) ? RegExp.$1 : false;
}
