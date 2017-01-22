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

//Declare the Discord and client constants used to set up the Discord bot
const Discord = require("discord.js");
const client = new Discord.Client();

//ytdl-core for !play
const yt = require('ytdl-core');

//Login to Discord's Bot API Service
client.login("");

//Set the running game and the avatar for the bot.
client.on('ready', function() {
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
		} else if (input[0] === '!play') {
			//Get the voice channel that it's going to play to.
			let voiceChannel = message.member.voiceChannel;
			
			//Check if the user is inside a voice channel
			if (!voiceChannel) {
				return richSend(message, "!play", "Please be in a voice channel before using the !play command", "#FFFF00");
			}
			
			//Check if there is an input
			//Purposefully split from the next if statement, if there is no input, the youtubeCheck() will fail
			if (!input[1]) {
				return richSend(message, "!play", "Please send a valid YouTube URL", "#FFFF00");
			}
			
			//Check if the YouTube URL is valid
			if (!youtubeCheck(input[1])) {
				return richSend(message, "!play", "Please send a valid YouTube URL", "#FFFF00");
			}
			
			//Get information about the YouTube URL
			yt.getInfo(input[1], function(err, info) {
				
				//Exits if there is no video to be found
				if (!info) {
					return richSend(message, "!play", "Please send a valid YouTube URL", "#FF0000");
				}
				
				//Exits if it's too long (that's what she said)
				if (info["length_seconds"] > 3600 && !(message.channel.permissionsFor(message.member).hasPermission("ADMINISTRATOR") || message.author.id === "190519304972664832")) {
					return richSend(message, "!play", "The duration of this video exceedes 1 hour.", "#FF0000");
				}
				
				//Say what it's about to do
				richSend(message, "Now playing:", info["title"], "#00FF00", info["thumbnail_url"], "https://youtube.com/watch?v=" + info["video_id"]);
				
				//Join the voiceChannel and blast the music.
				voiceChannel.join()
				.then(connnection => {
					
					//Forgot what this does (Thumbs up for documentation
					input[1] = input[1].replace(/%/g, "");
					let stream = yt(input[1], {audioonly: true});
					const dispatcher = connnection.playStream(stream);
					dispatcher.on('end', () => {
						//Leave after it's done
						voiceChannel.leave();
					});
					
				});
			});

		} else if (input[0] === '!stop') {
			
			//Check if the person has permission to stop the music
			if (!(message.channel.permissionsFor(message.member).hasPermission("ADMINISTRATOR") || message.author.id === "190519304972664832")) {
				return richSend(message, "!stop", "You do not have permission to stop the bot.", "#FF0000");
			}
			
			//Get the voice channel
			let voiceChannel = message.member.voiceChannel;
			
			//If the person is in the voice channel, stop the bot in that channel
			if (voiceChannel) {
				richSend(message, "!stop", "Stopped playing music in the channel.", "#00FF00");
				return voiceChannel.leave();
			} else {
				return richSend(message, "!stop", "There is no bot running in your current voice channel", "#FF0000");
			}
			
		} else if (input[0].toLowerCase().split('').filter(function(item, i, ar){ return ar.indexOf(item) === i; }).join('') === "cirletn"){
			//Remove all repeated characters and check if it matches 'cirletn'
			return richSend(message, "Circletine", "CCCCCCCCCCCIIIIIIIIIIIIIIIIIRRRRRRRRRRRRRRRRRRRRRRRRCCCCCCCCCCCCCCCCCCCCCCLLLLLLLLLLLLLLLLLLEEEEEEEEEEEEEEETTTTTTTTTTTTTTTTTTIIIIIIIIIIIIIINNNNNNNNNNNNNNEEEEEEEEEEE", "#FFFFFF");
		} else if (message.content === 'sexual tension') {
			//Send a fancy image.
			return richSend(message, "sexual tension", "sexual tension", "#FF9999", "http://moustacheminer.com/download/sexualtension2.png");
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
