const Discord = require("discord.js");
const config = require("./../../config.json");
const MSS = require("./../../functions/");
const request = require("request");

module.exports = function place(message) {
	let input = message.content.replace (/\n/g, "").split(" ");
	var user = encodeURI(input[1]);

	request('http://moustacheminer.com/place/searchapi.php?username=' + user, function(error, response, body) {
		if(error) {
			message.reply("An error occured while retrieving the data: " + error);
		}

		var data = JSON.parse(body);
		var response = "/r/place info for " + input[1] + "\n";

		data.info.forEach(function(element) {
			response += "Coloured (" + element.x + "," + element.y + ") " + element.colour + " at " + new Date(parseInt(element.time)) + "\n";
		});

		//Yes, false is a string. I'm so sorry
		if(data.error != "false") {
			message.reply(data.error);
		} else {
			var embed = new Discord.RichEmbed()
				.setTitle(input[1])
				.setAuthor("/r/place", "http://moustacheminer.com/mss.png")
				.setColor("#00AE86")
				.setDescription(response)
				.setFooter("MSS-Discord, " + config.MSS.version, "")
				.setTimestamp()
				.setURL("http://moustacheminer.com/place/?username=" + user);

			message.channel.sendEmbed(embed, "", { disableEveryone: true });
		}
	});
}
