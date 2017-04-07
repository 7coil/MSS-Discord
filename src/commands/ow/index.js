const Discord = require("discord.js");
const config = require("./../../config.json");
const request = require('request');

module.exports = function manpages(message) {
	let input = message.content.replace(/\n/g, " ").split(" ");

	//Make the input the correct format
	input[1] = input[1].toLowerCase();
	input[2] = input[2].toLowerCase();
	input[3] = input[3].replace("#", "-");
	var owUrl = "http://127.0.0.1:3000/profile/" + input[1] + "/" + input[2] + "/" + input[3];
	request(owUrl, function (error, response, body) {
		if (response.statusCode === 404) {
			return message.reply("The playertag was not found. Did you insert the correct region and/or device, and is the capitalisation of the tag correct?");
		} else if (response.statusCode === 200){
			var owData = JSON.parse(body);

			var embed = new Discord.RichEmbed()
				.setDescription("Overwatch Stats")
				.setFooter("MSS-Discord, " + config.MSS.version, "")
				.setTimestamp()
				.addField("Quickplay", "Playtime: " + owData["playtime"]["quickplay"] + "\nWins: " + owData["games"]["quickplay"]["wins"])
				.addField("Competitive", "Playtime: " + owData["playtime"]["competitive"] + "\nWins: " + owData["games"]["competitive"]["wins"] + "\nGames: " + owData["games"]["competitive"]["played"] + "\n\nRank: " + owData["competitive"]["rank"]);


			message.channel.sendEmbed(embed, "", { disableEveryone: true });
		}
	});
}
