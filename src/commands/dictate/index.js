const MSS = require("./../../functions/");

module.exports = function yt(message) {
	let input = message.content.replace (/\n/g, " ").split(" ");
	
	input.shift();
	input.shift();

	let encoded = encodeURIComponent(input.join(" "));

	MSS.music.add(message, "http", `http://talk.moustacheminer.com/get?input=${encoded}`, "MSS DecTalk", "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2b/DECtalk_DCT01_and_Tink.jpg/300px-DECtalk_DCT01_and_Tink.jpg");
}

