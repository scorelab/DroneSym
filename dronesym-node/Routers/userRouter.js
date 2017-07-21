var express = require('express');
var router = express.Router();
var userCtrl = require('../Controllers/userCtrl');
var passport = require('passport')

router.post('/login', function(req, res){
	userCtrl.loginUser(req.body.uname, req.body.password, function(status){
		res.json(status);
	});
})

router.post('/create', passport.authenticate('jwt', { session: false }), function(req, res){
	userCtrl.createUser(req.body.uname, req.body.password, function(status){
		res.json(status);
	})
})

router.get('/authenticate', passport.authenticate('jwt', { session: false }), function(req, res){
	res.json('Authorized');
})

module.exports = router;