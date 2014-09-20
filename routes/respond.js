
var mongoose = require("mongoose");
var Meetup = mongoose.model("Meetup");

var Notification = require("../helpers/notifications");

module.exports = function(app) {
	app.post("/meetup/:id/respond", function(req, res){
		var response = parseInt(req.body.response); // 0 for reject, 1 for accept

		if (response === 1) {
			response = true;
		} else {
			response = false;
		}

		var meetupId = req.params.id;

		Meetup.findById(meetupId, function(err, meetup){
			if (err || !meetup) {
				res.status(404).send();
				return;
			}

			if (response) {
				meetup.response = response;
				meetup.save();
			}

			res.send({success: 1});

			User.find({username: { $in: [meetup.senderId, meetup.receiverId ] }}, function(err, users){
				users.forEach(function(user){
					Notification.sendToUser(user, {type: "MeetupResponse", meetup: meetup, response: response});
				});
			});
		});
	});
}