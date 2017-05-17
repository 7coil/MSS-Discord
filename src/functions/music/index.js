const Player = require("./player.js");
const Players = [];

exports.init = init;
exports.add = add;

function init(message) {
	if(typeof obj === 'function') {
		Players[message.guild.id] = new Player(message);
	}
}

function add(message, type, url, title, thumb) {
	Players[message.guild.id].add(type, url, title, thumb);
}
