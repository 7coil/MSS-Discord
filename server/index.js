require('colors');

console.log('  Welcome to "Moustacheminer Server Services"!  '.inverse.bold);
console.log('Loading modules:');

const config = require('config');
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const engines = require('consolidate');
const os = require('os');
const path = require('path');

const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const auth = require('./auth');
const authRouter = require('./auth/auth-router');

const botname = config.get('name');

// Database
const r = require('./db');

// Discord
const discord = require('./discord');
const cogs = require('./discord/cogs.js').info;

// Middleware
app.use(session(
	{
		secret: config.get('secret'),
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
		res.render('index.html', { user: req.user, botname });
	})
	.get('/info', (req, res) => {
		const data = {};
		const nav = req.query.nav !== undefined;
		data.shards = discord.shards.size || 'No Sharding';
		data.hardware = `(${os.arch()}) ${os.cpus()[0].model} clocked at ${os.cpus()[0].speed} MHz`;
		data.software = `[${os.type()}] ${os.release()}`;
		data.hostname = os.hostname();
		data.uptime = Math.floor(process.uptime());
		data.guilds = discord.guilds.size;
		data.users = discord.users.size;
		res.status(200).render('info.html', { user: req.user, data, nav, botname });
	})
	.get('/manual', (req, res) => {
		const nav = req.query.nav !== undefined;
		r.table('commands')
			.run(r.conn, (err1, cursor) => {
				if (err1) res.status(500).render('error.html', { user: req.user, status: 500, message: err1.message, botname });
				cursor.toArray((err2, result) => {
					if (err2) res.status(500).render('error.html', { user: req.user, status: 500, message: err2.message, botname });
					if (!result) return res.status(404).render('error.html', { user: req.user, status: 404, message: `Apparently ${config.get('name')} has no commands.`, botname });
					const data = result.sort((a, b) => {
						if (a.message.embed.title.toLowerCase() < b.message.embed.title.toLowerCase()) return -1;
						if (a.message.embed.title.toLowerCase() > b.message.embed.title.toLowerCase()) return 1;
						return 0;
					});
					return res.render('manual.html', { user: req.user, command: data, nav, botname });
				});
			});
	})
	.get('/promo', (req, res) => {
		res.status(200).render('promo.html', {
			user: req.user,
			cogs,
			prefixes: config.get('discord').prefix,
			prefix: config.get('discord').prefix[0],
			botname
		});
	})
	.get('/music/:id', (req, res) => {
		const guild = discord.guilds.get(req.params.id);
		const nav = req.query.nav !== undefined;

		if (typeof guild === 'undefined') {
			res.status(404).render('error.html', { user: req.user, status: 404, message: 'The guild could not be found.', botname });
		} else {
			r.table('playlist')
				.get(guild.id)('playlist')
				.run(r.conn, (err, result) => {
					if (err) {
						res.status(404).render('error.html', { user: req.user, status: 404, botname });
					} else {
						const indexedarray = result.map((elem, index) => {
							elem.index = index;
							return elem;
						});

						res.status(200).render('music.html', { user: req.user, playlist: indexedarray, nav, botname });
					}
				});
		}
	})
	.use(express.static(path.join(__dirname, '/../client')))
	.use('*', (req, res) =>
		res.status(404).render('error.html', { user: req.user, status: 404, botname })
	);

io.on('connection', (socket) => {
	const infostream = setInterval(() => {
		const data = {
			time: new Date().getTime(),
			uptime: Math.floor(process.uptime()),
			ram: process.memoryUsage(),
			user: discord.users.size,
			guild: discord.guilds.size,
			voice: discord.voiceConnections.size
		};
		socket.emit('info', data);
	}, 500);

	socket.on('disconnect', () => {
		clearInterval(infostream);
	});
});

// Error!
process.on('uncaughtException', (err) => {
	if (err.code === 'ECONNRESET') {
		console.log('ECONNREST occured, stream broke');
	} else {
		console.log('Moustacheminer Server Services has crashed!'.red);
		console.log(err.stack);
		process.exit(1);
	}
});

// Initialisation process
console.log('Webserver listening on port', config.get('webserver').port);
server.listen(config.get('webserver').port);
