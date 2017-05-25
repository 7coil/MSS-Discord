const config = require("./../../config.json");
const MSS = require("./../../functions/");
const meta = require("./meta.json");

module.exports = function screenshot(message) {
	if(MSS.msg.isadmin(message)) {

		message.channel.fetchMessages({limit: 100})
			.then((messages)=>{
				let msgs = messages.filter((msg) => {
					return msg.author.id === message.client.user.id;
				});

				msgs.forEach((msg)=>{
					msg.delete();
				});
			});
	}
}
