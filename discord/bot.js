//Get Discord.js
const Discord = require("discord.js");
const client = new Discord.Client();

//Set up MSS inside the client for global things
client.mss = {};
client.mss.man = [];
client.mss.commands = [];
client.mss.functions = require("./functions/")
client.mss.api = require("./config/api.json");
//Get config files
client.mss.config = require("./config/config.json");
client.mss.mss = require("./config/mss.json");


const execFile = require("child_process").execFile;

//Include all subfolders
execFile("find", ["./commands", "-type", "d", "-not", "-path", "./commands"], (error, stdout, stderr) => {
	if (error) {
		throw error;
	}

	stdout.split("\n").forEach((item, iterator, array)=>{
		if(iterator + 1 == array.length) return false;
		let name = item.replace("./commands/", "").replace(/\/+/g, " ");
		client.mss.commands[name] = require(item);
		client.mss.man[name] = require(`${item}/meta.json`)
		console.log(`Included "${name}"`);
	});
})

//Login to Discord
client.login(client.mss.api.discord);

client.on("ready", function() {
	console.log("Successfully connected to Discord!");

	client.user.setGame("mss.ovh " + client.mss.mss.version);

	//Push both types of mention to the allowed prefixes array
	client.mss.config.prefix.push(`<@!${client.user.id}>`);

	//Send DBOTS info if it was provided.
	if (client.mss.api.botdiscordpw) {
		client.mss.functions.system.dbotsupdate(client);
		setInterval(() => {
			client.mss.functions.system.dbotsupdate(client);
		}, 1800000);
	}

	//Send FAKEDBOTS info if it was provided.
	if (client.mss.api.discordbotsorg) {
		client.mss.functions.system.fakedbotsupdate(client);
		setInterval(() => {
			client.mss.functions.system.fakedbotsupdate(client);
		}, 1800000);
	}
});

client.on("message", function(message) {
	if(!(message.prefix = client.mss.config.prefix.find(prefix=>{return message.content.startsWith(prefix)}))) return false;
	message.words = message.content.replace(/\n/g, " ").split(/\ +/g);
	if(message.words[0] === message.prefix) {message.words.shift()} else {message.words[0] = message.words[0].substring(message.prefix.length)};
	message.content = message.words.join(" ");
	if(message.command = Object.keys(client.mss.commands).reverse().find(command=>{return message.content.startsWith(command)})) {
		message.content = message.content.substring(message.command.length + 1) || null;
		message.words = message.content ? message.content.replace(/\n/g, " ").split(/\ +/g) : [];
		return client.mss.commands[message.command](message);
	};
});

process.on("unhandledRejection", function(err) {
	console.error("Uncaught Promise Error: \n" + err.stack);
});
