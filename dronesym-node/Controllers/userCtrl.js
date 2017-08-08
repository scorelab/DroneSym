var User = require('../Models/user');
var jwt = require('jsonwebtoken');
var jwtConfig = require('../config/jwtconfig');


var tokenizeUserInfo = function(user){
	var userInfo = {};
	userInfo.id = user._id;
	userInfo.name = user.uname;

	var token = jwt.sign(userInfo, jwtConfig.secret, {
		expiresIn: jwtConfig.expiresIn,
		issuer: jwtConfig.issuer
	});

	return token;
}

exports.createUser = function(uname, password, role, callBack){
	if(!uname || !password){
		callBack({ status: "ERROR", msg: "Username and password must be specified"})
		return;
	}

	User.findOne({ uname: uname }, function(err, user){
		if(err){
			callBack({ status: "ERROR", msg: err });
			return;
		}

		if(user){
			callBack({ status: "ERROR", msg: "Username already taken"});
			return;
		}

		var user = new User();

		user.uname = uname;
		user.password = password;
		user.role = role;

		user.save(function(err, status){
			if(err){
				callBack({ status: "ERROR", msg: err });
				return;
			}

			var token = tokenizeUserInfo(status);
			callBack({ status: "OK", token: "JWT " + token });
		})
	})
}

exports.loginUser = function(uname, password, callBack){
	if(!uname || !password){
		callBack({ status: "ERROR", msg: "Username and password must be specified" });
		return;
	}

	User.findOne({ uname: uname}, function(err, user){
		if(err){
			callBack({ status: "ERROR", msg: err });
			return;
		}

		if(!user){
			callBack({ status: "ERROR", msg: "Invalid username"});
			return;
		}

		user.comparePassword(password, function(err, isMatched){
			if(err){
				callBack({ status: "ERROR", msg: err });
				return;
			}

			if(isMatched){
				var token = tokenizeUserInfo(user);
				callBack({ status: "OK", token: "JWT " + token, role: user.role });
			}
			else{
				callBack({ status: "ERROR", msg: "Invalid password"});
			}
		})

	});
}

exports.authorizeUser = function(roles){
	return function(req, res, next){
		var user = req.user;

		if(roles.indexOf(user.role) > -1){
			next()
		}
		else{
			res.status(401).json('Unauthorize');
			return;
		}
	}
}
