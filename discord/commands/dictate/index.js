module.exports = function yt(message) {
	let encoded = encodeURIComponent(message.content);

	message.client.mss.functions.music.add(message, "http", `http://talk.moustacheminer.com/get?input=${encoded}`, "MSS DecTalk", "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2b/DECtalk_DCT01_and_Tink.jpg/300px-DECtalk_DCT01_and_Tink.jpg");
}

