var User = require('../Models/user');
var Group = require('../Models/group');
var jwt = require('jsonwebtoken');
var jwtConfig = require('../config/jwtconfig');
var db = require('../db.js');


var updateUsers = function(droneId, userInfo, insert=true) {
	let droneRef = db.ref('drones/' + droneId + '/users');

	droneRef.once("value", function(snapshot) {
		var users = snapshot.val();

		if(insert) {
			users.push(userInfo);
		}
		else {
			users = users.filter(function(user) {
				return (user.userId != userInfo.userId && user.groupId != userInfo.groupId) || user.groupId === "creator";
			});
		}

		if(users.length == 0) {
			users.push(userInfo);
		}

		droneRef.set(users);
	})
}

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

exports.updateUserGroups = function(userId, groupId, insert=true, callBack) {
	User.findOne({ _id : userId }, function(err, user) {
		if(err) {
			callBack({ status : "ERROR", msg : err });
			return;
		}

		if(!user) {
			callBack({ status : "ERROR", msg : "User not found" });
			return;
		}

		Group.findOne({ _id : groupId }, function(err, group) {
			if(err) {
				callBack({ status : "ERROR", msg : err });
				return;
			}

			if(!group) {
				callBack({ status : "ERROR", msg : "Group not found" });
				return;
			}

			let drones = group.drones;

			drones.forEach(function(drone) {
				let userInfo = { userId : userId, groupId : groupId };
				updateUsers(drone, userInfo, insert);
			});

			callBack({ status : "OK" });
		})
	})
}
