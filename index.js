const i18n = require('i18n');
const path = require('path');

i18n.configure({
	defaultLocale: 'en-gb',
	directory: path.join(__dirname, 'locales'),
	objectNotation: true
});

require('./src/discord/index');
