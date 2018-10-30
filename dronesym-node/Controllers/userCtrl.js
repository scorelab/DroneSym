var User = require('../Models/user');
var Group = require('../Models/group');
var jwt = require('jsonwebtoken');
var jwtConfig = require('../config/jwtconfig');
var db = require('../example.db.js');


var updateFirebase = function(droneId, userInfo, insert=true) {

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

var filterUser = function(user) {
	return {
		id : user._id,
		uname : user.uname,
		groups : user.groups
	}
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

	Group.findOne({ _id : groupId }, function(err, group) {

		if(err) {
			callBack({ status : "ERROR", msg : err });
			return;
		}

		if(!group) {
			callBack({ status : "ERROR", msg : "Group not found" });
			return;
		}

		let groupInfo = { userId : userId, groupId : groupId, groupName : group.name };

		User.findOne({ _id : userId }, function(err, user) {

			if(err) {
				callBack({ status : "ERROR", msg : err });
				return;
			}

			let drones = group.drones;

			drones.forEach(function(droneId) {
				updateFirebase(droneId, groupInfo, insert);
			});

			if(insert) {
				User.findOneAndUpdate({ _id : userId }, { $push : { groups : groupInfo }} , { new : true }, function(err, user) {
					if(err) {
						callBack({ status : "ERROR", msg : err });
						return;
					}

					callBack({ status : "OK", user : filterUser(user)});
				});
			}
			else {
				User.findOneAndUpdate({ _id : userId }, { $pull : { groups : { $in : [{ groupId : groupId }]}}}, { new : true }, function(err, user) {
					if(err) {
						callBack({ status : "ERROR" });
						return;
					}

					callBack({ status : "OK", user : filterUser(user) });
				});
			}
		})
	})
}

exports.getUserList = function(userId, callBack) {
	User.find({ _id : { $ne : userId }}, function(err, users) {
		if(err) {
			callBack({ status : "ERROR", msg : err });
			return;
		}

		if(!users) {
			callBack({ status : "ERROR", msg : "No user found"});
			return;
		}

		let filteredUsers = users.map(function(user) {
			return {
				id : user._id,
				uname : user.uname,
				groups : user.groups.map((drone) => {
					return {
						groupId : drone.groupId,
						groupName : drone.groupName
					}
				})
			}
		});

		callBack({ status : "OK", users : filteredUsers });
	})
}
