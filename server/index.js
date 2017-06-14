const config = require('config');
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const engines = require('consolidate');
const os = require('os');
const path = require('path');

const app = express();
const auth = require('./auth');
const authRouter = require('./auth/auth-router');

// Database
const r = require('./db');

// Discord
const discord = require('./discord');

// Middleware
app.use(session(
	{
		secret: config.get('session').secret,
		resave: false,
		saveUninitialized: true,
		proxy: true
	}))
	.use(auth.initialize())
	.use(auth.session())
	.use(bodyParser.json())
	.use(bodyParser.urlencoded({
		extended: true
	}));

// Views
app.set('views', path.join(__dirname, '/views'))
	.engine('html', engines.mustache)
	.set('view engine', 'html');

// Routes
app.use('/auth', authRouter)
	.get('/', (req, res) => {
		res.render('index.html', { user: req.user });
	})
	.get('/info', (req, res) => {
		const data = {};
		const nav = req.query.nav !== undefined;
		data.shards = (discord.shards && discord.shards.size) || 'No Sharding';
		data.hardware = `(${os.arch()}) ${os.cpus()[0].model} clocked at ${os.cpus()[0].speed} MHz`;
		data.software = `[${os.type()}] ${os.release()}`;
		data.hostname = os.hostname();
		data.uptime = Math.floor(process.uptime());

		discord.fetchClientValues('guilds.size').then((info1) => {
			data.guilds = info1.reduce((a, b) => a + b, 0);
			discord.fetchClientValues('users.size').then((info2) => {
				data.users = info2.reduce((a, b) => a + b, 0);
				discord.fetchClientValues('ping').then((info3) => {
					data.ping = {};
					data.ping.max = Math.floor(info3.reduce((a, b) => Math.max(a, b)));
					data.ping.min = Math.floor(info3.reduce((a, b) => Math.min(a, b)));
					if (data.ping.min < 50) {
						data.ping.css = 'list-group-item-success';
					} else if (data.ping.min < 150) {
						data.ping.css = 'list-group-item-warning';
					} else {
						data.ping.css = 'list-group-item-danger';
					}
					return res.status(200).render('info.html', { user: req.user, data, navoff: nav });
				});
			});
		}).catch(err =>
			res.status(500).render('error.html', { user: req.user, status: 500, message: err.message })
		);
	})
	.get('/manual', (req, res) => {
		const nav = req.query.nav !== undefined;
		r.table('commands')
			.run(r.conn, (err1, cursor) => {
				if (err1) res.status(500).render('error.html', { user: req.user, status: 500, message: err1.message });
				cursor.toArray((err2, result) => {
					if (err2) res.status(500).render('error.html', { user: req.user, status: 500, message: err2.message });
					if (!result) return res.status(404).render('error.html', { user: req.user, status: 404, message: 'Apparently MSS has no commands.' });
					const data = result.sort((a, b) => {
						if (a.message.embed.title.toLowerCase() < b.message.embed.title.toLowerCase()) return -1;
						if (a.message.embed.title.toLowerCase() > b.message.embed.title.toLowerCase()) return 1;
						return 0;
					});
					return res.render('manual.html', { user: req.user, command: data, navoff: nav });
				});
			});
	})
	.use(express.static(path.join(__dirname, '/../client')))
	.use('*', (req, res) =>
		res.status(404).render('error.html', { user: req.user, status: 404 })
	);


console.log('Welcome to MOUSTACHEMINER SERVER SERVICES');
console.log('=========================================');

// Initialisation process
console.log('Listening on', config.get('ports').http);
app.listen(config.get('ports').http);
