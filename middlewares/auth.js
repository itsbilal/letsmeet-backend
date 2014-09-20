
var mongoose = require("mongoose");
var User = mongoose.model("User");

module.exports = function(req, res, next) {
	req.user = {
		isAuthenticated: false
	};
	var username = req.get("X-WWW-Authenticate");

	if (!username) {
		req.user.isAuthenticated = false;
		next();
		return;
	}

	User.findOne({username: username}, function(err, user){
		if (err) throw err;

		if (!user) {
			res.status(400).send({error: "Incorrect username"});
			return;
		}

		req.user = user;

		req.user.isAuthenticated = true;

		next();
	});
}