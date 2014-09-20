
var mongoose = require("mongoose");
var schema = {
	username: String,
	//accessToken: String,
	facebookId: Number,

	devices: [ String ],

	joined: Date
};

mongoose.model("User", schema);