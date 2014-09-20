
var mongoose = require("mongoose");
var schema = {
	username: String,
	//accessToken: String,
	facebookId: Number,

	devices: [ String ],

	joined: {type: Date, default: Date.now()}
};

mongoose.model("User", schema);