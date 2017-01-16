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
	if(message.author.bot) return;
	
	let input = message.content.replace( /\n/g, " " ).split(" ");
	message.guild.member(client.user).setNickname('MSS');

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
			.addField('MSS Discord', 'http://discord.gg/invite/527K7hg');

		return message.channel.sendEmbed(embed, "", { disableEveryone: true });
	}
	
	if (input[0] === '!play') {
		let voiceChannel = message.member.voiceChannel;
		if (!voiceChannel) {
        	return richSend(message, "!play", "Please be in a voice channel before using the !play command", "#FFFF00");
	    }
		
		if (!input[1]) {
        	return richSend(message, "!play", "Please send a valid YouTube URL", "#FFFF00");
	    }
		
		voiceChannel.join()
			.then(connnection => {
				input[1] = input[1].replace(/%/g, "");
				let stream = yt(input[1], {audioonly: true});
				const dispatcher = connnection.playStream(stream);
				dispatcher.on('end', () => {
					voiceChannel.leave();
				});
			}).catch( error => {
				richSend(message, "!play", error.message, "#FF0000");
				console.log(error);
			});
	}

	if(input[0].toLowerCase().split('').filter(function(item, i, ar){ return ar.indexOf(item) === i; }).join('') === "cirletn"){
		return richSend(message, "Circletine", "CCCCCCCCCCCIIIIIIIIIIIIIIIIIRRRRRRRRRRRRRRRRRRRRRRRRCCCCCCCCCCCCCCCCCCCCCCLLLLLLLLLLLLLLLLLLEEEEEEEEEEEEEEETTTTTTTTTTTTTTTTTTIIIIIIIIIIIIIINNNNNNNNNNNNNNEEEEEEEEEEE", "#FFFFFF");
	}
	
	if(message.content === 'sexual tension') {
		return richSend(message, "sexual tension", "sexual tension", "#FF9999", "https://cdn.discordapp.com/attachments/255362900187807744/269947744381042688/unknown.png");
	}
	
	if (message.content.includes('┻') || message.content.includes('╩')) {
		return message.channel.sendMessage("┬─┬﻿ ノ( ゜-゜ノ)");
	}
	
});

function richSend(message, subheading, description, colour, img) {
	var embed = new Discord.RichEmbed()
		.setTitle(subheading)
		.setAuthor("MSS", 'http://moustacheminer.com/dickbutt.jpg')
		.setColor(colour)
		.setDescription(description)
		.setFooter('moustacheminer.com server services', '')
		.setTimestamp()
		.setURL('http://moustacheminer.com/w/mss')
		.setImage(img);

	message.channel.sendEmbed(embed, "", { disableEveryone: true });
}
