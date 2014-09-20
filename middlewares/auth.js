
var mongoose = require("mongoose");
var User = mongoose.model("User");
var FB = require("fb");

module.exports = function(req, res, next) {
	req.user = {
		isAuthenticated: false
	};

	if (!req.get("X-WWW-Authenticate")) {
		req.user.isAuthenticated = false;
		next();
		return;
	}

	var header = req.get("X-WWW-Authenticate").split(" "),
		username = header[0],
		token = header[1];

	User.findOne({username: username}, function(err, user){
		if (err) throw err;

		// Todo: Do the latter check using Facebook's API.
		if (!user) {
			res.status(400).send({error: "Incorrect username"});
			return;
		}

		FB.setAccessToken(token);
		FB.api("/me", 'get', {}, function(res){
			if (!res || res.error) {
				// Incorrect auth token
				res.status(401).send({error: "Incorrect access token"});
				return;
			} else {
				req.user = user;
				req.user.accessToken = token;
				req.user.isAuthenticated = true;

				next();
			}
		});
	});
}