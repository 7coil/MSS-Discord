const config = require("./../../config.json");
const API = require("./../../api.json");
const MSS = require("./../../functions/");
const searchYT = require('youtube-node');
const searchYTClient = new searchYT();
const yt = require('ytdl-core');
searchYTClient.setKey(API.youtube);

module.exports = function yt(message) {
	if (!message.guild) return MSS.msg.rich(message, "Error", "You are not allowed to send this command via Direct Messaging.", "#FF0000");
	let input = message.content.replace (/\n/g, " ").split(" ");
	//Get the voice channel that it's going to play to.
	let voiceChannel = message.member.voiceChannel;
	//Check if the user is inside a voice channel or has inputted anything.
	if (!voiceChannel) {
		MSS.msg.react(message, false, "call");
		return false;
	} else if (!input[2]) {
		MSS.msg.react(message, false, "link");
		return false;
	}

	MSS.music.add(message, "http", input[2], "Custom URL", "https://i.mss.ovh/cloud.png");
}

