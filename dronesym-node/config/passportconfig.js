var JwtStrategy = require('passport-jwt').Strategy;
var ExtractJwt = require('passport-jwt').ExtractJwt;
var jwtConfig = require('./jwtconfig');
var User = require('../Models/user');

var jwtOptions = {
	jwtFromRequest: ExtractJwt.fromAuthHeader(),
	secretOrKey:jwtConfig.secret
}

var jwtAuthenticate = new JwtStrategy(jwtOptions, function(payload, done){
	console.log(payload);

	User.findById(payload.id, function(err, user){
		if(err){
			done(err);
			return;
		}

		if(user){
			done(null, user);
		}
		else{
			console.log('User not found');
			done(null, false);
		}

	});
})

module.exports = function(passport){
	passport.use(jwtAuthenticate);
}