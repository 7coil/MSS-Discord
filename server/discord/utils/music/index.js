const Player = require('./player.js');
const utils = require('./../../utils.js');

const Players = [];

function guildError(message) {
	message.channel.createMessage('You cannot run this command outside a guild!');
}

function vcCheck(message) {
	if (message.member.voiceState.channelID) {
		return true;
	}
	message.channel.createMessage('You are not in a voice channel');
	return false;
}

function botCheck(message) {
	if (Players[message.channel.guild.id].connection) {
		return true;
	}
	message.channel.createMessage('There is no bot in the guild');
	return false;
}

function adminCheck(message) {
	if (utils.isadmin(message.member)) {
		return true;
	}
	message.channel.createMessage('You are not an Administrator!');
	return false;
}

function init(message, client) {
	console.log(typeof Players[message.channel.guild.id]);
	if (typeof Players[message.channel.guild.id] !== 'undefined') return;
	Players[message.channel.guild.id] = new Player(message, client);
}

function add(message, client, type, url, title, thumb) {
	if (!message.channel.guild) return guildError(message);
	init(message, client);
	if (!vcCheck(message)) return false;
	Players[message.channel.guild.id].message = message;
	return Players[message.channel.guild.id].add(type, url, title, thumb);
}

function addSilent(message, client, type, url, title, thumb) {
	if (!message.channel.guild) return;
	if (!message.member.voiceChannel) return;
	init(message, client);
	Players[message.channel.guild.id].message = message;
	Players[message.channel.guild.id].add(type, url, title, thumb);
}

function stop(message, client) {
	if (!message.channel.guild) return guildError(message);
	init(message, client);
	if (!botCheck(message)) return false;
	if (!adminCheck(message)) return false;
	return Players[message.channel.guild.id].stop();
}

function skip(message, client) {
	if (!message.channel.guild) return guildError(message);
	init(message, client);
	if (!botCheck(message)) return false;
	if (!adminCheck(message)) return false;
	return Players[message.channel.guild.id].skip();
}

function list(message, client) {
	if (!message.channel.guild) return;
	init(message, client);
	if (!botCheck(message)) return;
	if (Players[message.channel.guild.id].playlist.length > 0) {
		let string = 'Playlist\n```\n';
		Players[message.channel.guild.id].playlist.every((elem, index) => {
			if ((`${string}\n${index} - ${elem.title}`).length > 1900) {
				string += '...';
				return false;
			}
			string += `${index} - ${elem.title}\n`;
			return true;
		});
		string += '```';
		message.channel.createMessage(string);
	} else {
		message.channel.createMessage('The Playlist is empty');
	}
}

exports.init = init;
exports.add = add;
exports.addSilent = addSilent;
exports.stop = stop;
exports.skip = skip;
exports.list = list;
