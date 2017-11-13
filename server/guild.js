const express = require('express');
const r = require('./db');

const router = express.Router();

router.use('/:id/playlist', async (req, res) => {
	const playlist = (await r.table('playlist')
		.get(req.params.id)) || null;
	if (!playlist) {
		res.render('error');
	} else {
		res.render('list', { playlist });
	}
});

module.exports = router;
