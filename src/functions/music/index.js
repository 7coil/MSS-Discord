const Player = require("./player.js");
const MSS = require('./../../functions/');
const config = require("./../../config.json");
const Discord = require("discord.js");
const meta = require("./meta.json");

const Players = [];

exports.init = init;
exports.add = add;
exports.addSilent = addSilent;
exports.stop = stop;
exports.skip = skip;
exports.list = list;
exports.panel = panel;
exports.get = get;

function init(message) {
	console.log(typeof Players[message.guild.id]);
	if(typeof Players[message.guild.id] === 'undefined') {
		Players[message.guild.id] = new Player(message);
	}
}

function add(message, type, url, title, thumb) {
	if (!message.guild) return guildError(message);
	init(message);
	if (!vcCheck(message)) return;
    Players[message.guild.id].message = message;
	Players[message.guild.id].add(type, url, title, thumb);
}

function addSilent(message, type, url, title, thumb) {
	if (!message.guild) return;
	if (!message.member.voiceChannel) return;
	init(message);
    Players[message.guild.id].message = message;
	Players[message.guild.id].add(type, url, title, thumb);
}

function stop(message) {
	if (!message.guild) return guildError(message);
	init(message);
	if (!botCheck(message)) return;
	if (!adminCheck(message)) return;
	Players[message.guild.id].stop();
}

function skip(message) {
	if (!message.guild) return guildError(message);
	init(message);
	if (!botCheck(message)) return;
	if (!adminCheck(message)) return;
	Players[message.guild.id].skip();
}

function list(message) {
	if (!guildCheck(message)) return;
	init(message);
	if (!botCheck(message)) return;
	if(Players[message.guild.id].playlist.length > 0) {
		var string = "Playlist\n```\n"
		Players[message.guild.id].playlist.every((elem, index) => {
			if((`${string}\n${index} - ${elem.title}`).length > 1900) {
				string += "..."
				return false;
			} else {
				string += `${index} - ${elem.title}\n`;
				return true;
			}
		});
		string += "```"
		message.channel.send(string)
	} else {
		message.channel.send(meta[message.data.lang] && meta[message.data.lang].playlist_empty || "playlist_empty")
	}
}

function get(message) {
    if (!guildCheck(message)) return;
	init(message);
    if (!botCheck(message)) return;
    //Send a fancy embed with images and shit
	var embed = new Discord.RichEmbed()
		.setTitle(meta[message.data.lang] && meta[message.data.lang].music_player || "music_player")
		.setColor("#00FF00")
		.setDescription(`${meta[message.data.lang] && meta[message.data.lang].now_playing || "now_playing"}: ${Players[message.guild.id].current.title}`)
		.setFooter("MSS-Discord, " + config.MSS.version, "")
		.setTimestamp()
		.setURL(Players[message.guild.id].current.url)
		.setImage(Players[message.guild.id].current.thumb_url);

	//Send that embed. Hurray.
	message.channel.send("", { embed: embed, disableEveryone: true });
}

function panel(message) {
    if (!guildCheck(message)) return;
	message.channel.send(`**${meta[message.data.lang] && meta[message.data.lang].music_player || "music_player"}**`)
	.then(function(message) {
		message.react(String.fromCodePoint(10145));
		message.react(String.fromCodePoint(8505));
		message.react(String.fromCodePoint(128240));
	});
}

function guildCheck(message) {
	if(message.guild) {
		return true;
	} else {
		message.channel.send(meta[message.data.lang] && meta[message.data.lang].guild_error || "guild_error");
		return false;
	}
}

function vcCheck(message) {
	if (message.member.voiceChannel) {
		return true;
	} else {
		message.channel.send(meta[message.data.lang] && meta[message.data.lang].voice_error || "voice_error");
		return false;
	}
}
function botCheck(message) {
	if (Players[message.guild.id].connection) {
		return true;
	} else {
		message.channel.send(meta[message.data.lang] && meta[message.data.lang].bot_error || "bot_error");
		return false;
	}
}
function adminCheck(message) {
	if(MSS.msg.isadmin(message)) {
		return true;
	} else {
		message.channel.send(meta[message.data.lang] && meta[message.data.lang].admin_error || "admin_error");
		return false;
	}
}
