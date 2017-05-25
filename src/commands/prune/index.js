const config = require("./../../config.json");
const MSS = require("./../../functions/");
const meta = require("./meta.json");

module.exports = function screenshot(message) {
	if(MSS.msg.isadmin(message)) {
		let fetch = "";
		let del = "";

		message.channel.fetchMessages({limit: 100})
			.then(messages => {
				console.log(messages.length);
				message.channel.bulkDelete(messages.filter((message) => {return message.author.id === client.user.id}))
			})
			.catch((err)=>{fetch = err.fetch;});

		if(fetch || del) message.channel.send(`${meta[message.data.lang] && meta[message.data.lang].err_prune || "err_prune"}\n${fetch}\n${del}`)
	}
}
