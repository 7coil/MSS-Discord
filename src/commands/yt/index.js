const config = require("./../../config.json");
const API = require("./../../api.json");
const MSS = require("./../../functions/");
const searchYT = require('youtube-node');
const searchYTClient = new searchYT();
const yt = require('ytdl-core');
const meta = require("./meta.json");
searchYTClient.setKey(API.youtube);

module.exports = function yt(message) {
	if (!message.guild) {
		reply = {
			response: {
				name: meta.meta.name,
				to: message.author.username,
				error: true,
				output: "This command has been disabled for Direct Messaging"
			}
		}

		MSS.msg.xml(message, reply);

		return false;
	}

	let input = message.content.replace (/\n/g, "").split(" ");
	//Get the voice channel that it's going to play to.
	let voiceChannel = message.member.voiceChannel;
	//Check if the user is inside a voice channel or has inputted anything.
	if (!voiceChannel) {
		reply = {
			response: {
				name: meta.meta.name,
				to: message.author.username,
				error: true,
				output: "You are not in a voice channel."
			}
		}

		MSS.msg.xml(message, reply);
		return false;
	} else if (!input[1]) {
		reply = {
			response: {
				name: meta.meta.name,
				to: message.author.username,
				error: true,
				output: "You did not provide a search term."
			}
		}

		MSS.msg.xml(message, reply);
		return false;
	}

	searchYTClient.search(message.content.substring(input[0].length + 1), 1, function(error, result) {
		if (error) {
			reply = {
				response: {
					name: meta.meta.name,
					to: message.author.username,
					error: true,
					output: "An internal error occured"
				}
			}

			MSS.msg.xml(message, reply);
			return false;
		} else if (!result["items"][0]) {
			reply = {
				response: {
					name: meta.meta.name,
					to: message.author.username,
					error: true,
					output: "No search results found."
				}
			}

			MSS.msg.xml(message, reply);
			return false;
		} else {
			MSS.music.add(message, "youtube", "https://youtube.com/watch?v=" + result["items"][0]["id"]["videoId"], result["items"][0]["snippet"]["title"], result["items"][0]["snippet"]["thumbnails"]["default"]["url"]);

			reply = {
				response: {
					name: meta.meta.name,
					to: message.author.username,
					error: false,
					output: {
						message: "ADD",
						type: "youtube",
						location: "https://youtube.com/watch?v=" + result["items"][0]["id"]["videoId"],
						title: result["items"][0]["snippet"]["title"],
						thumb: result["items"][0]["snippet"]["thumbnails"]["default"]["url"]
					}
				}
			}

			MSS.msg.xml(message, reply);
		}
	});
}

