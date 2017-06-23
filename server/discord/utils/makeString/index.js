module.exports = function makeString(input) {
	let text = null;

	if (typeof input === 'string') {
		text = input;
	} else if (typeof input === 'number') {
		text = input.toString();
	} else if (typeof input === 'boolean') {
		text = input;
	} else if (typeof input === 'object') {
		text = JSON.stringify(input);
	} else {
		throw new Error('Failed to convert to String.');
	}

	return text;
};
