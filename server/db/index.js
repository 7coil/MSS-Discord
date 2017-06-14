const r = require('rethinkdb');
const config = require('config');
require('rethinkdb-init')(r);

r.connections = [];
r.getNewConnection = () =>
	r.connect(config.get('rethinkdb'))
		.then((conn) => {
			conn.use(config.get('rethinkdb').db);
			r.connections.push(conn);
			return conn;
		});


r.connect(config.get('rethinkdb')).then((conn) => {
	r.conn = conn;
	r.connections.push(conn);
	r.conn.use(config.get('rethinkdb').db);
});

module.exports = r;
