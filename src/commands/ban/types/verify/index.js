const MSS = require("./../../functions/");

module.exports = (message, connection) => {
	MSS.msg.react(message, true);
};
