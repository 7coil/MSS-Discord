const Player = require("./player.js");
const Players = [];

exports.init = init;
exports.add = add;
exports.stop = stop;
exports.skip = skip;

function init(message) {
	console.log(typeof Players[message.guild.id]);
	if(typeof Players[message.guild.id] === 'undefined') {
		Players[message.guild.id] = new Player(message);
	}
}

function add(message, type, url, title, thumb) {
	init(message)
	Players[message.guild.id].add(type, url, title, thumb);
}

function stop(message) {
	if(Players[message.guild.id]) Players[message.guild.id].stop();
}

function skip(message) {
	if(Players[message.guild.id]) Players[message.guild.id].skip();
}
