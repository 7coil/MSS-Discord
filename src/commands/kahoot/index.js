const config = require("./../../config.json");
const MSS = require("./../../functions/")
const Discord = require("discord.js");
const meta = require("./meta.json");

module.exports = function help(message) {
	let input = message.content.replace(/\n/g, "").split(" ");
	if(!input[2]) return message.channel.send("No UUID/URL or command supplied.");
	if(input[2] === "stop") return MSS.kahoot.stop(message);
	let n = input[2].lastIndexOf('/');
	let id = input[2].substring(n+1);
	MSS.kahoot.add(message, id);
}
