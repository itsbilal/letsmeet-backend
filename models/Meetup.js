
var mongoose = require("mongoose");
var schema = {
	senderId: String,
	receiverId: String,

	senderLocation: {
		lat: Number,
		lon: Number
	},

	receiverLocation: {
		lat: Number,
		lon: Number
	},

	meetupLocation: {
		lat: Number,
		lon: Number
	},

	fulfilled: {type: Boolean, default: false},
	response: {type: Boolean, default: false},

	initiated: {type: Date, default: Date.now()}
};

mongoose.model("Meetup", schema);