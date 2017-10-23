console.log('Welcome to Moustacheminer Server Services');

//	const config = require('config');
//	const express = require('express');
const path = require('path');
const i18n = require('i18n');
require('./discord');

i18n.configure({
	directory: path.join(__dirname, '..', 'locales'),
	cookie: 'lang',
	defaultLocale: 'en-gb',
	autoReload: true,
	updateFiles: false
});
//
//	const app = express();
//
//	app.enable('trust proxy')
//		.set('views', path.join(__dirname, 'dynamic'))
//		.set('view engine', 'pug')
//		.get('/', (req, res) => {
//			res.render('index');
//		})
//		.use(express.static(path.join(__dirname, 'static')))
//		.use('*', (req, res) => res.status(404).render('error'));
//
//	console.log('Listening on', config.get('webserver').port);
//	app.listen(config.get('webserver').port);

process.on('unhandledRejection', (reason) => {
	console.dir(reason);
});

process.on('uncaughtException', (err) => {
	if (err.code === 'ECONNRESET') {
		console.log('ECONNREST occured, stream broke');
	} else {
		console.log('Moustacheminer Server Services has crashed!');
		console.log(err.stack);
		process.exit(1);
	}
});
