module.exports = function reactWith(message, success, type) {
	if (success) {
		message.react(String.fromCodePoint(128077));
		return;
	} else {
		message.react(String.fromCodePoint(128078));
	}

	if (type === "link") {
		message.react(String.fromCodePoint(128279));
	} else if (type === "call") {
		message.react(String.fromCodePoint(128222));
	} else if (type === "bomb") {
		message.react(String.fromCodePoint(128163));
	} else if (type === "x") {
		message.react(String.fromCodePoint(10060));
	} else if (type === "ruler") {
		message.react(String.fromCodePoint(128207));
	}
}
