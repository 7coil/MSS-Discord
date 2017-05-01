const MSS = require("./../../functions/");

module.exports = (message, connection) => {
	const input = message.content.replace(/\n/g, ' ').split(' ');
    /*
     * An anatomy of the input, by 7coil:
     *
     *    0      1    2       3         4
     * @mention ban guild <guild id> [reason]
	 *
	 * A guild ID and the owner id is always numerical, but is in a string.
	 * Anything after the guild id is the reason, which is at a maximum of 2000 characters.
     *
     */

	//Check if the required vars are there
	if(!(input[3])) {
		message.reply('Valid usage: `mention ban guild <guild id> [reason]`.\nFor banning bot collection servers.');
		return false;
	}

	//We should be ready. First, we turn the ID into a numerical string.
	let guildid = input[3].replace(/\D+/g, '');

	//Finally, we do a specific insert based on if there is a reason.

	let reason = "";
	if(input[4]) {
		reason = input.splice(4).join(" ");
	} else {
		reason = "No reason provided.";
	}

	connection.query('INSERT INTO banned_guilds (guild_ID, administrators_administrator_ID, reason) VALUES (?, ?, ?)', [guildid, message.author.id, reason], (err) => {
		if (err) {
			message.reply(err.message);
			MSS.msg.react(message, false, "bomb");
		} else {
			MSS.msg.react(message, true);
		};
	});
};
