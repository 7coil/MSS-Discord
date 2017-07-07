const r = require('./db');
const config = require('config');

setTimeout(() => {
	r.init(config.get('api').rethinkdb, [
		{
			name: 'users',
			indexes: ['login']
		},
		{
			name: 'csrf',
			indexes: ['csrf']
		},
		{
			name: 'commands',
			indexes: ['']
		}
	]).then((conn) => {
		r.conn = conn;
		r.connections.push(conn);
		r.conn.use(config.get('rethinkdb').db);
		process.exit(1);
	});
}, 3000);
