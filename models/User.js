
var mongoose = require("mongoose");
var schema = {
	username: String,
	facebookId: Number,

	joined: Date
};

mongoose.model("User", schema);