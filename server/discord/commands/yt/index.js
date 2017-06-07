const searchYT = require('youtube-node');
const searchYTClient = new searchYT();
const config = require('config');
searchYTClient.setKey(config.get("api").youtube);

module.exports = function yt(message) {

	searchYTClient.search(message.content, 1, function(error, result) {
		if (error) {
			console.log(error);
			message.reply(error);
			message.client.mss.functions.msg.react(message, false, "bomb");
			return false;
		} else if (!result["items"][0]) {
			message.reply("No search results found.");
			message.client.mss.functions.msg.react(message, false, "X");
			return false;
		} else {
			message.client.mss.functions.msg.react(message, true);
			message.client.mss.functions.music.add(message, "youtube", "https://youtube.com/watch?v=" + result["items"][0]["id"]["videoId"], result["items"][0]["snippet"]["title"], result["items"][0]["snippet"]["thumbnails"]["default"]["url"]);
		}
	});
}

