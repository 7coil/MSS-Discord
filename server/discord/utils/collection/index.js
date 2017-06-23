const r = require('./../../../db');
const client = require('./../../');

function guildStats(guild) {
	const name = guild.name;
	const id = guild.id;
	const users = guild.members.filter(member => !member.user.bot).size;
	const total = guild.members.size;
	const bots = total - users;
	const percentage = Math.floor((bots / total) * 100);
	const pass = !(percentage > 50 && total > 20);

	return { name, id, users, bots, total, percentage, pass };
}

function banGuild(id) {
	client.guilds.get(id).leave();
	r.table('collection')
		.insert({
			guild: id
		})
		.run(r.conn, (err) => {
			if (err) throw new Error('Couldn\'t save banned guild.');
			console.log(`Banned ${client.guilds.get(id).name}`);
		});
}

client.on('guildCreate', (guild) => {
	const report = guildStats(guild);

	if (!report.pass) {
		console.log(`${guild.name} failed the authentication test`);
		banGuild(guild.id);
	} else {
		r.table('collection')
			.filter({ guild: guild.id })
			.run(r.conn, (err1, cursor) => {
				if (err1) throw new Error('Failed to search banned guild database.');
				cursor.toArray((err2, result) => {
					if (err2) throw new Error('Failed to convert banned cursor to results.');
					if (result.length === 0) {
						console.log(`${guild.name} passed the authentication test`);
					} else {
						console.log(`${guild.name} was already banned!`);
					}
				});
			});
	}
});

module.exports = banGuild;
