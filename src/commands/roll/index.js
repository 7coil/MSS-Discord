const Discord = require("discord.js");
const config = require("./../../config.json");
const MSS = require("./../../functions/");

module.exports = function(message, client) {
	let input = message.content.replace(/\n/g, " ").split(" ");
	let sides = 6;
	let rolls = 1;
	var result = [];
	var output, sum;


	if(input[1] && input[1].startsWith("d")) {
		//Check if it's trying to roll an "n" sided die.
		sides = parseInt(input[1].substring(1).replace(/[^0-9]+/g, ''));
	} else if (input[1]){
		//Roll the dice the number of times stated
		rolls = parseInt(input[1].replace(/[^0-9]+/g, ''));
	}

	if(input[2]) {
		rolls = parseInt(input[1].replace(/[^0-9]+/g, ''));
		sides = parseInt(input[1].replace(/[^0-9]+/g, ''));
	}

	if(!rolls || !sides || rolls < 1 || sides < 2) {
		//You can't roll something with no die, no sides, less than 1 roll or with less than 2 sides.
		MSS.msg.react(message, false, "x");
	}

	if(rolls == 1) {
		output = "Rolled a " + sides + "-sided die.";
	} else {
		//Rolled 6 6-sided dice.
		output = "Rolled " + rolls + " " + sides + "-sided dice.";
	}

	for(i=0; i<rolls; i++) {
		let value = randInt(sides);
		sum += value;
		result.push(value);
	}

	var embed = new Discord.RichEmbed()
		.setTitle("MSS-Discord")
		.setAuthor("Random Number Generator", "http://moustacheminer.com/mss.png")
		.setColor("#00AE86")
		.setDescription(output)
		.setFooter("MSS-Discord, " + config.MSS.version, "")
		.setTimestamp()
		.setURL("http://moustacheminer.com/")
		.addField("Die output", result)
		.addField("Total", sum);

	message.channel.sendEmbed(embed, "", { disableEveryone: true })
		.catch(function(e) {
			console.log(e);
		});
}

function randInt(d) {
	return Math.floor(Math.random() * d) + 1
}
