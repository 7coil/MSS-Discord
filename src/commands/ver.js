const git = require('git-rev');
const config = require("./../config.json");

var past = [];
past = git.log(function(array){return array;});
var long = git.long(function(commit){return commit;});
var short = git.short(function(commit){return commit;});

module.exports = function version(message) {

	message.reply("I sent a message via Direct Messaging with details enclosed.");
	message.author.sendMessage(`
**MSS, also known as Moustacheminer Server Services**
_Version ` + config.MSS.version + `, serving 2.6969696969696970 channels since 2016_

MSS-Discord Version History
\`\`\`
	Commit ID:
	`+past[0][0]+`
	`+short[0][0].substring(7)+`

	Last commit by: `+past[0][3]+` `+past[0][2]+`

	Comment from last commit:
	`+past[0][1]+`
\`\`\`
`);
}
