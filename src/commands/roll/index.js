const Discord = require("discord.js");
const config = require("./../../config.json");
const MSS = require("./../../functions/");

module.exports = function(message, client) {
	let input = message.content.replace(/\n/g, " ").split(" ");
	let sides = 6;
	let rolls = 1;
	let sum = 0;
	var result = [];
	var output = "";


	if(input[2] && input[2].startsWith("d")) {
		//Check if it's trying to roll an "n" sided die.
		sides = parseInt(input[2].substring(1));
	} else if (input[2]){
		//Roll the dice the number of times stated
		rolls = parseInt(input[2]);
	}

	if(input[3]) {
		rolls = parseInt(input[2]);
		sides = parseInt(input[3]);
	}

	if(!rolls && !(rolls === 0) || !sides && !(sides === 0)) {
		return message.reply("A parse error occured.");
	}


	//Set A
	if (rolls === 0) {
		output += "Did not roll ";
	} else {
		output += "Rolled "
	}

	//Set B, C and D
	if (rolls === 1) {
		output += "a ";
		if (sides === 0) {
			output += "shape with no sides.";
		} else if (sides === 1) {
			output += "mobius strip."
		} else {
			output += sides + "-sided dice.";
		}
	} else {
		output += rolls + " ";
		if (sides === 0) {
			output += "die with no sides.";
		} else if (sides === 1) {
			output += "mobius strips."
		} else {
			output += sides + "-sided die.";
		}
	}

	if (sides < 0 && rolls < 0) {
		output += "\nHowever, such a theoretical shape could not be rolled for a negative number of times.";
		sum = "Error";
		result.push("Error");
	} else if (sides < 0) {
		output += "\nHowever, such a theoretical shape could not be rolled.";
		sum = "Error";
		result.push("Error");
	} else if (rolls < 0) {
		output += "\nHowever, such a shape cannot be rolled for a negative number of times.";
		sum = "Error";
		result.push("Error");
	} else if (rolls > 1000) {
        output += "\nHowever, this was way too much to handle for MSS.";
        sum = "Error";
        result.push("Error");
    } else if (rolls === 0 || sides === 0) {
		sum = 0;
		result.push(0);
	} else {
		for(i=0; i<rolls; i++) {
			let value = randInt(sides);
			sum += value;
			result.push(value);
		}
	}

	var embed = new Discord.RichEmbed()
		.setDescription(output)
		.addField("Total", sum);

	if (result.join(" ").length < 512) {
		embed.addField("Die output", result.join(" "));
	} else {
		embed.addField("Error", "The output is too long to display");
	}

	message.channel.send("", { embed: embed, disableEveryone: true })
		.catch(function(e) {
			console.log(e);
		});
}

function randInt(d) {
	return Math.floor(Math.random() * d) + 1
}
