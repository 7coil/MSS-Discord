const fs = require('fs');

const commands = {};

const CommandOverlapException = (name, file) => {
	this.message = `Alias ${name} from ${file} was already assigned to another command!`;
	this.name = 'CommandOverlapException';
};

// Register valid commands from "cogs"
fs.readdir('./server/discord/cogs/', (err, items) => {
	items.forEach((item) => {
		const file = item.replace(/['"]+/g, '');
		const cog = require(`./cogs/${file}`); // eslint-disable-line global-require, import/no-dynamic-require
		cog.forEach((com) => {
			com.names.forEach((alias) => {
				if (commands[alias]) {
					throw new CommandOverlapException(alias, file);
				} else {
					commands[alias] = com;
				}
			});
		});
	});
});

module.exports = commands;
