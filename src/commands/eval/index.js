const config = require("./../../config.json");
const MSS = require("./../../functions/");
const meta = require("./meta.json");

module.exports = function(message) {
	if(message.author.id === config.MSS.sysadmin) {
		let input = message.content.replace (/\n/g, "").split(" ");
		input[0] = input[0].substring(config.MSS.prefix.length);
		try {
			eval(message.content.substring(config.MSS.prefix.length + input[0].length + 1));
			reply = {
				response: {
					name: meta.name,
					to: message.author.username,
					error: false,
					output: err.stack
				}
			}
		} catch(err) {
			reply = {
				response: {
					name: meta.name,
					to: message.author.username,
					error: true,
					output: "An error occured",
					stack: err.stack
				}
			}
		}
	} else {
		reply = {
			response: {
				name: meta.name,
				to: message.author.username,
				error: true,
				output: "You do not have permission to run this command."
			}
		}
	}

	MSS.msg.xml(message, reply);
}

