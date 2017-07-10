require('colors');
const fs = require('fs');

const commands = [];
const info = [];

module.exports.reload = () => {
	// Register valid commands from "cogs"
	fs.readdir('./server/discord/cogs/', (err, items) => {
		items.forEach((item) => {
			const file = item.replace(/['"]+/g, '');
			const command = require(`./cogs/${file}/`); // eslint-disable-line global-require, import/no-dynamic-require
			const infomation = command.info;
			infomation.id = command.info.aliases[0];
			info.push(infomation);
			command.info.aliases.forEach((name) => {
				if (commands[name]) console.log(`Alias ${name} from ${file} was already assigned to another command! Overwriting...`.red);
				commands[name] = require(`./cogs/${file}/`); // eslint-disable-line global-require, import/no-dynamic-require
			});
		});
	});
};

module.exports.reload();
module.exports.cogs = commands;
module.exports.info = info;

//	module.exports.info = {
//		name: 'Redbot Help',
//		category: 'Info',
//		aliases: [
//			'red',
//			'commands'
//		]
//	};
