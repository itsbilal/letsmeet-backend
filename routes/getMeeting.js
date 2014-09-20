
var mongoose = require("mongoose");
var Meetup = mongoose.model("Meetup");

module.exports = function(app) {
	app.get("/meetup/:id", function(req, res){
		Meeting.findById(req.params.id, function(err, meeting){
			if (!meeting) {
				res.status(404).send();
				return;
			}

			res.send({meeting: meeting});
		});
	})
}