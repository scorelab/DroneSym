var express = require('express');
var router = express.Router();
var userCtrl = require('../Controllers/userCtrl');
var passport = require('passport');

var authorize = userCtrl.authorizeUser;
var authenticate = passport.authenticate('jwt', { session: false });

router.post('/login', function(req, res){
	userCtrl.loginUser(req.body.uname, req.body.password, function(status){
		res.json(status);
	});
})

router.post('/create', authenticate, authorize(['admin']), function(req, res){
	userCtrl.createUser(req.body.uname, req.body.password, function(status){
		res.json(status);
	})
})

router.get('/authenticate', authenticate, function(req, res){
	res.json('Authorized');
})

module.exports = router;