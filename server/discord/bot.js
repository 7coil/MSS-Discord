//Get Discord.js
const Discord = require("discord.js");
const client = new Discord.Client();
const config = require('config');

//Set up MSS inside the client for global things
client.mss = {};
client.mss.commands = [];
client.mss.functions = require("./functions/");
client.mss.prefix = config.get("prefix");

const execFile = require("child_process").execFile;

//Include all subfolders
execFile("find", ["./server/discord/commands", "-type", "d", "-not", "-path", "./server/discord/commands"], (error, stdout, stderr) => {
	if (error) {
		throw error;
	}

	console.log(stdout);

	stdout.split("\n").forEach((item, iterator, array)=>{
		if(iterator + 1 == array.length) return false;
		let name = item.replace("./server/discord/commands/", "").replace(/\/+/g, " ");
		let path = item.replace("./server/discord/commands/", "./commands/")
		client.mss.commands[name] = require(path);
		console.log(`Included "${name}"`);
	});
})

//Login to Discord
client.login(config.get("api").discord.bot);

client.on("ready", function() {
	console.log("Successfully connected to Discord!");

	client.user.setGame(config.get("useragent"));

	//Push both types of mention to the allowed prefixes array
	client.mss.prefix.push(`<@${client.user.id}>`);
	client.mss.prefix.push(`<@!${client.user.id}>`);

	//Send DBOTS info if it was provided.
	if (config.get("api").botsdiscordpw) {
		client.mss.functions.system.dbotsupdate(client);
		setInterval(() => {
			client.mss.functions.system.dbotsupdate(client);
		}, 1800000);
	}

	//Send FAKEDBOTS info if it was provided.
	if (config.get("api").discordbotsorg) {
		client.mss.functions.system.fakedbotsupdate(client);
		setInterval(() => {
			client.mss.functions.system.fakedbotsupdate(client);
		}, 1800000);
	}
});

client.on("message", function(message) {
	if(!(message.prefix = client.mss.prefix.find(prefix=>{return message.content.startsWith(prefix)}))) return false;
	if(config.get('selfbot') && !(config.get('admins').includes(message.author.id))) return false;
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
