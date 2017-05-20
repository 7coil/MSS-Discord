const Discord = require("discord.js");
const config = require("./../../config.json");
const MSS = require("./../../functions/");
const request = require("request");

module.exports = function place(message) {
	let input = message.content.replace (/\n/g, "").split(" ");
	var user = encodeURI(input[2]);

    message.reply("Your query has been sent to the database. Please wait for a response.");

	request('http://moustacheminer.com/place/searchapi.php?username=' + user, function(error, response, body) {
		if(error) {
			message.reply("An error occured while retrieving the data: " + error);
		}

		var data = JSON.parse(body);
		var reply;
		var colour = [];

		for (i=0; i<16; i++) {
			colour[i] = 0;
		}

		if(!data.info) {
			reply += "The user has not placed any dots down, or does not exist.";
		} else {
			data.info.forEach(function(element) {
				colour[element.colour]++
			});

			reply = `Info for ` + user + `
\`\`\`
White      | ` + colour[0]  + ` | ` + ((colour[0]  / data.info.length)*100).toFixed(2) + `%
Light Grey | ` + colour[1]  + ` | ` + ((colour[1]  / data.info.length)*100).toFixed(2) + `%
Grey       | ` + colour[2]  + ` | ` + ((colour[2]  / data.info.length)*100).toFixed(2) + `%
Black      | ` + colour[3]  + ` | ` + ((colour[3]  / data.info.length)*100).toFixed(2) + `%
Pink       | ` + colour[4]  + ` | ` + ((colour[4]  / data.info.length)*100).toFixed(2) + `%
Red        | ` + colour[5]  + ` | ` + ((colour[5]  / data.info.length)*100).toFixed(2) + `%
Orange     | ` + colour[6]  + ` | ` + ((colour[6]  / data.info.length)*100).toFixed(2) + `%
Brown      | ` + colour[7]  + ` | ` + ((colour[7]  / data.info.length)*100).toFixed(2) + `%
Yellow     | ` + colour[8]  + ` | ` + ((colour[8]  / data.info.length)*100).toFixed(2) + `%
Lime       | ` + colour[9]  + ` | ` + ((colour[9]  / data.info.length)*100).toFixed(2) + `%
Green      | ` + colour[10] + ` | ` + ((colour[10] / data.info.length)*100).toFixed(2) + `%
Cyan       | ` + colour[11] + ` | ` + ((colour[11] / data.info.length)*100).toFixed(2) + `%
Blue       | ` + colour[12] + ` | ` + ((colour[12] / data.info.length)*100).toFixed(2) + `%
Dark Blue  | ` + colour[13] + ` | ` + ((colour[13] / data.info.length)*100).toFixed(2) + `%
Magenta    | ` + colour[14] + ` | ` + ((colour[14] / data.info.length)*100).toFixed(2) + `%
Purple     | ` + colour[15] + ` | ` + ((colour[15] / data.info.length)*100).toFixed(2) + `%
-----------------------------
Total      | ` + data.info.length + `\`\`\``;
		}

		//Yes, false is a string. I'm so sorry
		if(data.error != "false") {
			message.reply(data.error);
		} else {
			var embed = new Discord.RichEmbed()
				.setTitle(input[1])
				.setAuthor("/r/place info for " + input[1], "http://moustacheminer.com/mss.png")
				.setColor("#00AE86")
				.setDescription(reply)
				.setFooter("MSS-Discord, " + config.MSS.version, "")
				.setTimestamp()
				.setURL("http://moustacheminer.com/place/?username=" + user)
				.addField("Powered by /r/PlaceDevs", "Please go to this URL to view the rest of the log. http://moustacheminer.com/place/?username=" + user);

			message.channel.send("", { embed: embed, disableEveryone: true });
		}
	});
}
