
var mongoose = require("mongoose");
var User = mongoose.model("User");

var Notification = require("../helpers/notifications");

/*
  POST: /initiate

  Need to be authenticated (use the HTTP header "X-WWW-Authenticate: <userID on Facebook> <access token>"" to authenticate)

  Body parameters (all urlencoded):
  	- receiverId: Facebook ID of friend
  	- lat, lon: Your location

  This endpoint sends a notification to receiver (identified by receiverId),
  and gets the receiver app to send its location back to the server (through the addReceiverLocation endpoint).
*/
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