
var mongoose = require("mongoose");
var User = mongoose.model("User");

module.exports = function(app){

	/*
		POST /addDevice

		Must be authenticated.

		Body parameters:
			- registrationId: GCM registration Id of device.
	*/
	app.post("/addDevice", function(req, res){

		if (!req.user.isAuthenticated) {
			res.status(401).send({error: "Unauthorized"});
			return;
		}

		if (!req.body.registrationId) {
			res.status(400).send({error: "No registration Id specified"});
			return;
		}

		var registrationId = req.body.registrationId;

		if (req.user.devices.indexOf(registrationId) < 0) {
			req.user.devices.push(registrationId);
			req.user.save(function(err){
				if (!err) {
					res.send({success: 1});
				}
			});
		} else {
			res.send({success: 1});
		}

	});
}