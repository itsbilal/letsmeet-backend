
var mongoose = require("mongoose");
var User = mongoose.model("User");

var Notification = require("../helpers/notifications");

module.exports = function(app) {
	app.post("/initiate", function(req, res) {
		if (!req.user.isAuthenticated) {
			res.status(401).send({error: "Unauthorized"});
			return;
		}

		User.findOne({username: req.body.friendId}, function(err, friend){
			if (err || !friend) {
				res.status(500).send({error: "Can't find friend"});
				return;
			}

			var meetup = new Meetup({
				senderId: req.user.username,
				receiverId: req.body.friendId,

				senderLocation: {
					lat: req.body.lat,
					lon: req.body.lon
				}
			});

			meetup.save(function(err){
				if (!err) {
					Notification.sendToUser(friend, {type: "MeetupInitiated", meetup: meetup});
					res.send({success: 1});
				}
			});
		});
	});
}