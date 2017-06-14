const config = require('config');
const react = require("./react");

module.exports = function isadmin(message) {
	if ((message.guild &&(message.channel.permissionsFor(message.member).has(0x00000008) ||message.member.roles.some((role)=>role.name.toLowerCase().includes("admin")) ||message.member.roles.some((role)=>role.name.toLowerCase().includes("mod"))))|| config.get("admins").includes(message.author.id)) {
		return true;
	} else {
		react(message, false, "x");
		return false;
	}
}
