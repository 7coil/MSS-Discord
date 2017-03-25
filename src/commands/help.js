const config = require("./../config.json");

module.exports = function help(message) {
	message.reply("I sent a message via Direct Messaging with details enclosed.");
	message.author.sendMessage(`
**MSS, also known as Moustacheminer Server Services**
_Version ` + config.MSS.version + `, serving 2.6969696969696970 channels since 2016_

For a list of commands, please run the '` + config.MSS.prefix + `man' command.
For help on a specific command, please run '` + config.MSS.prefix + `man <command>'.

Discord Server: http://moustacheminer.com/r/invite-server
Invite Bot: http://moustacheminer.com/r/invite-bot
GitHub: http://moustacheminer.com/r/github-bot
`);
}
