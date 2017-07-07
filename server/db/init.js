const r = require('./');
const config = require('config');
require('rethinkdb-init')(r);

r.init(config.get('api').rethinkdb, [
	{
		name: 'collection',
		indexes: ['guild']
	}, {
		name: 'collection',
		indexes: ['message']
	}, {
		name: 'csrf',
		indexes: []
	}, {
		name: 'markov',
		indexes: ['name', 'start', 'end', 'stats']
	}, {
		name: 'playlist',
		indexes: ['playlist']
	}, {
		name: 'users',
		indexes: ['login']
	}
]).then((conn) => {
	r.conn = conn;
	r.connections.push(conn);
	r.conn.use(config.get('api').rethinkdb.db);
});
