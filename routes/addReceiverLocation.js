
var mongoose = require("mongoose");
var User = mongoose.model("User");
var Meetup = mongoose.model("Meetup");

var Notification = require("../helpers/notifications");

module.exports = function(app) {
	app.post("/meetup/:id/addLocation", function(req, res) {
		if (!req.user.isAuthenticated) {
			res.status(401).send({error: "Unauthorized"});
			return;
		}

		Meeting.findById(req.param.id, function(err, meeting){
			if (!meeting) {
				res.status(404).send();
				return;
			}

			if (!meeting.receiverId === req.user.username) {
				res.status(401).send({error: "Unauthorized"});
				return;
			}

			meeting.fulfilled = true;
			meeting.receiverLocation = {
				lat: req.body.lat,
				lon: req.body.lon
			};

			meeting.save(function(err){
				if (!err) {
					res.send({success: 1});

					// Inform the sender
					User.findOne({username: meeting.senderId}, function(err, sender){
						if (err || !sender) {
							res.status(500).send();
							return;
						}

						Notification.sendToUser(sender, {type: "MeetupFulfilled", meeting: meeting});
					});
				}
			});
		});
	});
}