
var mongoose = require("mongoose");
var User = mongoose.model("User");

module.exports = function(app){
	app.post("/signup", function(req, res){

		if (!req.body.username) {
			res.status(400).send({error: "Bad request"});
			return;
		}

		User.findOne({username: req.body.username}, function(err, user){
			if (!user) {
				var user = new User();
				user.username = req.body.username;

				user.save(function(err){
					if (!err) {
						res.send({success: 1});
					}
				});
			} else {
				res.send({success: 1});
				return;
			}
		});

	});
}