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
		var reply = "";

		if(!data.info) {
			reply += "The user has not placed any dots down, or does not exist.";
		} else {
			data.info.forEach(function(element) {
				var colour;
				switch(parseInt(element.colour)) {
					case 1:
						colour = "Light Grey";
						break;
					case 2:
						colour = "Grey";
						break;
					case 3:
						colour = "Black";
						break;
					case 4:
						colour = "Pink";
						break;
					case 5:
						colour = "Red";
						break;
					case 6:
						colour = "Orange";
						break;
					case 7:
						colour = "Brown";
						break;
					case 8:
						colour = "Yellow";
						break;
					case 9:
						colour = "Lime";
						break;
					case 10:
						colour = "Green";
						break;
					case 11:
						colour = "Cyan";
						break;
					case 12:
						colour = "Blue";
						break;
					case 13:
						colour = "Dark Blue";
						break;
					case 14:
						colour = "Magenta";
						break;
					case 15:
						colour = "Purple";
						break;
					default:
						colour = "Invalid Colour ID";
						break;
				}



			});
		}

		//Yes, false is a string. I'm so sorry
		if(data.error != "false") {
			message.reply(data.error);
		} else {
			let overflow = message.content.replace (/\n/g, "");

			var embed = new Discord.RichEmbed()
				.setTitle(input[1])
				.setAuthor("/r/place info for " + input[1], "http://moustacheminer.com/mss.png")
				.setColor("#00AE86")
				.setDescription(overflow.shift() + overflow.shift())
				.setFooter("MSS-Discord, " + config.MSS.version, "")
				.setTimestamp()
				.setURL("http://moustacheminer.com/place/?username=" + user);

			if(overflow) {
				overflow.forEach(function(element) {
					embed.addField("Overflow", element);
				});
			}



			message.channel.sendEmbed(embed, "", { disableEveryone: true });
		}
	});
}
