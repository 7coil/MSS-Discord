module.exports = function choice(array) {
	// Select a random item in the array. That's it.
	return array[Math.floor(Math.random() * array.length)];
};
