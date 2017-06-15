module.exports = function pad(num, size) {
	let s = String(num);
	while (s.length < size) s = `0${s}`;
	return s;
};
