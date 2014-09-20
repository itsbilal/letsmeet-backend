
var mongoose = require("mongoose");
var User = mongoose.model("User");
var Meetup = mongoose.model("Meetup");

var Notification = require("../helpers/notifications");

/*
  POST /meetup/:id/addLocation

  Need to be authenticated

  URL parameter: ":id" - ID of meeting (sent as meeting._id in the GCM MeetingInitiated notification)
  Body parameters (application/x-www-form-urlencoded):
  	- lat, lon: Latitude and longitude of your location

  This API call is made by the recipient of the meetup, right after receiving the GCM MeetingInitiated notification.
  Its sole job is to store the receiver's location *and* relay it to the sender again.
*/
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