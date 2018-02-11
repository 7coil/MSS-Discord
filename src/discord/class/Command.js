let getFlags = (flag, string) => {
	const result = {};
	const split = string.split();
}

class Command {
	constructor(settings) {
		this.name = settings.name || 'command';
		this.flag = settings.flag || [];
	}
	parser(message) {
		
	}
}

module.exports = Command;
