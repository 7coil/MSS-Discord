function timestamp(s) {
	var d, h, m;

	m = Math.floor(s / 60);
	s = Math.floor(s % 60);

	h = Math.floor(m / 60);
	m = m % 60;

	d = Math.floor(h / 24);
	h = h % 24;

	var message = "";
	if(d === 1) {
		message += d + " day "
	} else if (d > 1) {
		message += d + " days "
	};

	if(m === 1) {
		message += m + " minute "
	} else if (m > 1) {
		message += m + " minutes "
	};

	if(s === 1) {
		message += s + " second "
	} else if (s > 1) {
		message += s + " seconds "
	};

	return message || "Literally no time whatsoever";
}
