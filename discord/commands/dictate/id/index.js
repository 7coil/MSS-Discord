module.exports = function dictate(message) {
	message.client.mss.functions.music.add(message, "http", `https://talk.moustacheminer.com/dec/${message.content}.wav`, "MSS DecTalk", "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2b/DECtalk_DCT01_and_Tink.jpg/300px-DECtalk_DCT01_and_Tink.jpg");
}
