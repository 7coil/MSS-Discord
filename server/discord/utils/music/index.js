const Player = require('./player.js');
const MSS = require('./../../utils.js');

const Players = [];

function guildError(message) {
	message.channel.send('You cannot run this command outside a guild!');
}
function vcCheck(message) {
	if (message.member.voiceChannel) {
		return true;
	}
	message.channel.send('You are not in a voice channel');
	return false;
}
function botCheck(message) {
	if (Players[message.guild.id].connection) {
		return true;
	}
	message.channel.send('There is no bot in the guild');
	return false;
}
function adminCheck(message) {
	if (MSS.msg.isadmin(message)) {
		return true;
	}
	message.channel.send('You are not an Administrator!');
	return false;
}
function init(message) {
	console.log(typeof Players[message.guild.id]);
	if (typeof Players[message.guild.id] !== 'undefined') return;
	Players[message.guild.id] = new Player(message);
}

function add(message, type, url, title, thumb) {
	if (!message.guild) return guildError(message);
	init(message);
	if (!vcCheck(message)) return false;
	Players[message.guild.id].message = message;
	return Players[message.guild.id].add(type, url, title, thumb);
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
	if (!botCheck(message)) return false;
	if (!adminCheck(message)) return false;
	return Players[message.guild.id].stop();
}

function skip(message) {
	if (!message.guild) return guildError(message);
	init(message);
	if (!botCheck(message)) return false;
	if (!adminCheck(message)) return false;
	return Players[message.guild.id].skip();
}

function list(message) {
	if (!message.guild) return;
	init(message);
	if (!botCheck(message)) return;
	if (Players[message.guild.id].playlist.length > 0) {
		let string = 'Playlist\n```\n';
		Players[message.guild.id].playlist.every((elem, index) => {
			if ((`${string}\n${index} - ${elem.title}`).length > 1900) {
				string += '...';
				return false;
			}
			string += `${index} - ${elem.title}\n`;
			return true;
		});
		string += '```';
		message.channel.send(string);
	} else {
		message.channel.send('The Playlist is empty');
	}
}

exports.init = init;
exports.add = add;
exports.addSilent = addSilent;
exports.stop = stop;
exports.skip = skip;
exports.list = list;
