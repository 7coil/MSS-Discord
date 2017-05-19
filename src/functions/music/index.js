const Player = require("./player.js");
const MSS = require('./../../functions/');
const config = require("./../../config.json");
const Discord = require("Discord.js");

const Players = [];

exports.init = init;
exports.add = add;
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
	if (!message.guild) return;
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
		Players[message.guild.id].channel.send(string)
	} else {
		Players[message.guild.id].channel.send("The Playlist is empty")
	}
}

function get(message) {
    //Send a fancy embed with images and shit
	var embed = new Discord.RichEmbed()
		.setTitle("MSS Music Player")
		.setAuthor("MSS", "http://moustacheminer.com/mss.png")
		.setColor("#00FF00")
		.setDescription("Now playing: " + Players[message.guild.id].current.title)
		.setFooter("MSS-Discord, " + config.MSS.version, "")
		.setTimestamp()
		.setURL(Players[message.guild.id].current.url)
		.setImage(Players[message.guild.id].current.thumb_url);

	//Send that embed. Hurray.
	message.channel.sendEmbed(embed, "", { disableEveryone: true });
}

function panel(message) {
    if (!message.guild) return;
	message.channel.sendMessage('**Music Control Panel**')
	.then(function(message) {
		message.react(String.fromCodePoint(10145));
		message.react(String.fromCodePoint(8505));
		message.react(String.fromCodePoint(128240));
	});
}

function guildError(message) {
	message.channel.send("You cannot run this command outside a guild!");
}
function vcCheck(message) {
	if (Players[message.guild.id].voicechannel) {
		return true;
	} else {
		Players[message.guild.id].channel.send("You are not in a voice channel");
		return false;
	}
}
function botCheck(message) {
	if (Players[message.guild.id].voicechannel && Players[message.guild.id].voicechannel.connection) {
		return true;
	} else {
		Players[message.guild.id].channel.send("There is no bot in your channel");
		return false;
	}
}
function adminCheck(message) {
	if(MSS.msg.isadmin(message)) {
		return true;
	} else {
		Players[message.guild.id].channel.send("You are not an Administrator!");
		return false;
	}
}
