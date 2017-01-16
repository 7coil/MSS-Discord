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
	client.user.setAvatar("http://moustacheminer.com/dickbutt.jpg")
});

client.on('message', message => {
	if(message.author.bot) return;
	
	let input = message.content.replace( /\n/g, " " ).split(" ");
	message.guild.member(client.user).setNickname('MSS')


	if (input[0] === '!help') {
		var embed = new Discord.RichEmbed()
			.setTitle('MSS')
				.setAuthor('Help', 'http://moustacheminer.com/dickbutt.jpg')
				.setColor(0x00AE86)
				.setDescription('Help can be found at our wiki page, or at the moustacheminer server services Discord server.')
				.setFooter('moustacheminer server services', '')
				.setTimestamp()
				.setURL('http://moustacheminer.com/w/mss')
				.addField('Wiki', 'http://moustacheminer.com/w/mss')
				.addField('MSS Discord', 'http://discord.gg/invite/527K7hg');

		return message.channel.sendEmbed(embed, "", { disableEveryone: true });
	}
	
	if (input[0] === '!play') {
		let voiceChannel = message.member.voiceChannel;
		if (!voiceChannel) {
        	return message.reply("Please be in a voice channel first!");
	    }
		voiceChannel.join()
		.then(connnection => {
			let stream = yt(input[1], {audioonly: true});
			const dispatcher = connnection.playStream(stream);
			dispatcher.on('end', () => {
				voiceChannel.leave();
			});
		});
	}

	if(input[0].toLowerCase().split('').filter(function(item, i, ar){ return ar.indexOf(item) === i; }).join('') === "cirletn"){
		return message.channel.sendMessage("CCCCCCCCCCCCCCCCIIIIIIIIIIIIIIIRRRRRRRRRRRRRRCCCCCCCCCCCCCLLLLLLLLLLLLLLLLEEEEEEEEEETTTTTTTTTTTTTTTTIIIIIIIIIIIIIIIINNNNNNNNNNNNNNEEEEEEEEEEEEEEEEE");
	}
	
});