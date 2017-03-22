const play = require('./play.js');

module.exports = function playSound(message) {
	var voiceChannel = message.member.voiceChannel;
	
	voiceChannel.join()
	.then(connnection => {
		var looper = function() {
			play(message);
			const dispatcher = connnection.playStream(global.stream[message.guild.id]);
			dispatcher.on('end', () => {
				looper();
			});
		}
		looper();
	});
}