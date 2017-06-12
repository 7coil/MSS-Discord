const authController = {};

authController.getUser = (req, res) => {
	if (req.user && req.user.id) {
		res.json(req.user);
		return;
	}
	res.status(400).json(null);
};

authController.logout = (req, res) => {
	req.logout();
	res.redirect('/');
};

authController.login = (req, res) => {
	res.redirect('/');
};

module.exports = authController;
