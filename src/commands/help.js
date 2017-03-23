const config = require("./../config.json");

module.exports = function help(message) {
	message.reply("I sent a message via Direct Messaging with details enclosed.");
	message.author.sendMessage(`
**MSS, also known as Moustacheminer Server Services**
_Version " + config.MSS.version + ", serving 2.6969696969696970 channels since 2016_

Commands
\`\`\`
//The help command gives a link to the MSS server.
`+config.MSS.prefix+`help

//The YouTube command supports either a URL or a search query
//Will only play over 3600 seconds of media if the user is an admin.
`+config.MSS.prefix+`yt <URL>n!!yt <Search Query>

//The skip command skips the currently playing song
//ADMIN ONLY
`+config.MSS.prefix+`skip

//The stop command skips and clears the playlist
//ADMIN ONLY
`+config.MSS.prefix+`stop

//This command executes javascript code in the script
//OWNER ONLY - CHANGE IF STATEMENT TO YOUR OWN ID IF YOU ARE RUNNING YOUR OWN BOT
`+config.MSS.prefix+`eval

//Pastes an invite link into the chat.
!!invite
\`\`\`

Discord Server: http://moustacheminer.com/r/invite-server
Invite Bot: http://moustacheminer.com/r/invite-bot
GitHub: http://moustacheminer.com/r/github-bot
`);
}
