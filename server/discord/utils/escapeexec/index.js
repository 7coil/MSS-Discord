module.exports = function escapeexec(input) {
	return input.replace(/\\/g, '\\\\')
		.replace(/\$/g, '\\$')
		.replace(/'/g, '\\\'')
		.replace(/"/g, '\\"');
};
