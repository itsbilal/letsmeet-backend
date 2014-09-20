
var express = require("express");
var app = express();

var bodyParser = require("body-parser");

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/letsmeet');

require("./models");

// Middleware
//app.use("/static", express.static(__dirname + "/static"));
app.use(bodyParser.urlencoded({extended: false}));
app.use(require("./middlewares/auth.js"));

// Include all routes
require("./routes")(app);

var server = app.listen(8080, function() {
    console.log('Listening on port %d', server.address().port);
});