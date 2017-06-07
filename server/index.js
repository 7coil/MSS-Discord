/*jshint node:true */
'use strict';

var config = require('config');
var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var engines = require('consolidate');
var fs = require('fs');
var os = require('os');

var app = express();
var auth = require('./auth');
var authRouter = require('./auth/auth-router');

// Database
var r = require("./db");

// Discord
var discord = require("./discord");

// Middleware
app.use(session({
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
app.set('views', __dirname + '/views')
	.engine('html', engines.mustache)
	.set('view engine', 'html');

// Routes
app.use('/auth', authRouter)
	.get('/', (req, res) => {
		res.render('index.html', { user: req.user });
	})
	.get('/info', (req, res) => {
		let data = {};
		let nav = req.query.nav !== undefined ? true : false;
		data.shards = discord.shards && discord.shards.size || "No Sharding";
		data.hardware = `(${os.arch()}) ${os.cpus()[0].model} clocked at ${os.cpus()[0].speed} MHz`;
		data.software = `[${os.type()}] ${os.release()}`
		data.hostname = os.hostname();
		data.uptime = timestamp(process.uptime());

		discord.fetchClientValues('guilds.size').then((info) => {
			data.guilds = info.reduce((a, b) => a + b, 0);
			discord.fetchClientValues('users.size').then((info) => {
				data.users = info.reduce((a, b) => a + b, 0);
				discord.fetchClientValues("ping").then((info)=>{
					data.ping = {}
					data.ping.max = Math.floor(info.reduce((a, b) => Math.max(a,b)));
					data.ping.min = Math.floor(info.reduce((a, b) => Math.min(a,b)));
					if (data.ping.min < 50) {
						data.ping.css = "list-group-item-success";
					} else if (data.ping.min < 150) {
						data.ping.css = "list-group-item-warning";
					} else {
						data.ping.css = "list-group-item-danger";
					}
					return res.status(200).render('info.html', { user: req.user, data: data, navoff: nav });
				});
			});
		}).catch((err)=>{
			return res.status(500).render('error.html', { user: req.user, status: 500, message: err.message });
		});
	})
	.get('/manual', (req, res) => {
		let input = req.url.split("/")[2];
		let nav = req.query.nav !== undefined ? true : false;
		r.table("commands")
			.run(r.conn, (err, cursor) => {
				if (err) res.status(500).render('error.html', { user: req.user, status: 500, message: err.message });
				cursor.toArray((err, result) => {
					if (err) res.status(500).render('error.html', { user: req.user, status: 500, message: err.message });
					if(!result) return res.status(404).render('error.html', { user: req.user, status: 404, message: "Apparently MSS has no commands." });
					let data = result.sort((a, b) => {
						if (a.message.embed.title.toLowerCase() < b.message.embed.title.toLowerCase()) return -1;
						if (a.message.embed.title.toLowerCase() > b.message.embed.title.toLowerCase()) return 1;
						return 0;
					});
					res.render('manual.html', { user: req.user, command: result, navoff: nav });
				});
			});
	})
	.use(express.static(__dirname + '/../client'))
	.use('*', (req, res) => {
		return res.status(404).render('error.html', { user: req.user, status: 404 });
	});

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
		message += d + " days "
	} else if (d > 1) {
		message += d + " day "
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


console.log("Welcome to MOUSTACHEMINER SERVER SERVICES");
console.log("=========================================");

//Initialisation process
console.log("Listening on", config.get('ports').http)
app.listen(config.get('ports').http);
