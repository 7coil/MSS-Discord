module.exports = function yt(message) {
	message.client.mss.functions.music.add(message, 'youtube', message.content, 'youtube-dl', 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ef/YouTube_logo_2015.svg/1200px-YouTube_logo_2015.svg.png');
};

