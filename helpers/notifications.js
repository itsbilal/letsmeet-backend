
var gcm = require("node-gcm");

module.exports = {
	sendToUser: function(user, message) {
		this.send(user.devices, message);
	},

	send: function(devices, message) {
		var sender = new gcm.Sender("AIzaSyBgzXDHVUbDBzZSbfI-q5EcoiMFmNpWBxw");
		var message = new gcm.Message({data: message});

		sender.send(message, devices, 4, function(err, result){
			console.log(result);
		});
	}
};