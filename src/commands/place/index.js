const Discord = require("discord.js");
const config = require("./../../config.json");
const MSS = require("./../../functions/");
const meta = require("./meta.json");
const request = require("request");

module.exports = function place(message) {
	let input = message.content.replace (/\n/g, "").split(" ");
	var user = encodeURI(input[1]);

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


		//Yes, false is a string. I'm so sorry
		if(data.error != "false") {
			message.reply(data.error);
		} else {
			data.info.forEach(function(element) {
				colour[element.colour]++
			});

			reply = {
				response: {
					name: meta.meta.name,
					to: message.author.username,
					error: false,
					output: {
						name: user,
						colour: {
							0: colour[0],
							1: colour[1],
							2: colour[2],
							3: colour[3],
							4: colour[4],
							5: colour[5],
							6: colour[6],
							7: colour[7],
							8: colour[8],
							9: colour[9],
							10: colour[10],
							11: colour[11],
							12: colour[12],
							13: colour[13],
							14: colour[14],
							15: colour[15],
						}
						count: data.info.length
						url: "http://moustacheminer.com/place/?username=" + user
					}
				}
			}

			MSS.msg.xml(message, reply);
		}
	});
}
