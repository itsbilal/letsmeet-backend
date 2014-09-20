

module.exports = function(app) {
	app.get("/test-auth", function(req, res){
		res.send({authenticated: req.user.isAuthenticated});
	});
}