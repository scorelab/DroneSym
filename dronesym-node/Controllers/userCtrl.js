var User = require('../Models/user');
var Group = require('../Models/group');
var jwt = require('jsonwebtoken');
var jwtConfig = require('../config/jwtconfig');
var db = require('../example.db');

/** Regular expression for email validation */
  regexp = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);

/**
 * Updates firebase db, in this case when user groups change
 * @param {string} droneId - id of drone
 * @param {object} userInfo - object containing userId, groupId and groupName
 * @param {boolean} insert - boolean informing whether users of given drone changed
 */
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
/**
 * Creates a JWT token out of given user object
 * @param {object} user - object containing params of user 
 */
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

/**
 * Extracts important informations out of user object
 * @param {object} user - object containing params of user 
 */
var filterUser = function(user) {
	return {
		id : user._id,
		uname : user.uname,
		groups : user.groups
	}
}


/**
 * Creates user with given parameters, and saves it in DB
 * @param {string} uname - username of user we want to create
 * @param {string} password - password of user we want to create, is later encrypted
 * @param {string} role - role of user we want to create, default is 'user', other is 'admin'
 * @param {function} callBack - function to return result of creating an user to
 */
exports.createUser = function(uname, email, password, role, callBack){
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
		user.email=email;
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
/**
 * Creates user from signup page with given parameters, and saves it in DB
 * @param {string} uname - username of user we want to create
 * @param {string} password - password of user we want to create, is later encrypted
 * @param {string} role - role of user we want to create, default is 'user'
 * @param {string} email - email of user we want to create
 * @param {function} callBack - function to return result of creating an user to
 */
exports.createUserFromSignup = function(uname, password,role,email,callBack){
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
		user.email=email;
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
/**
 * Logs in given user
 * @param {string} uname - username of given user
 * @param {string} password - password of given user
 * @param {string} callBack - function to return result of user login to
 */
exports.loginUser = function(uname, password, callBack){
	if(!uname || !password){
		callBack({ status: "ERROR", msg: "Username and password must be specified" });
		return;
	}

	if(regexp.test(uname)){
	User.findOne({ email: uname}, function(err, user){
		if(err){
			callBack({ status: "ERROR", msg: err });
			return;
		}

		if(!user){
			callBack({ status: "ERROR", msg: "Invalid Email-Id"});
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
}   else{
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
}

/**
 * Function that authorizes user (IDK where it is used)
 * @param {array} roles - array of roles
 */
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
/**
 * Function to update user array of groups
 * @param {string} userId - id of user
 * @param {string} groupId - id of group
 * @param {boolean} insert - boolean informing whether users of given drone changed
 * @param {function} callBack - function to return result of updating user groups to
 */
exports.updateUserInGroup=function(userId, groupId, insert=true, callBack){

	User.findOne({ _id : userId }, function(err, user) {

		if(err) {
			callBack({ status : "ERROR", msg : err });
			return;
		}
		console.log(user)
		
		let userInfo = {userId: userId, userName: user.uname}
		console.log(groupId)

		Group.findOne({ _id : groupId }, function(err, group) {

			if(err) {
				callBack({ status : "ERROR", msg : err });
				return;
			}
	
			if(!group) {
				callBack({ status : "ERROR", msg : "Group not found" });
				return;
			}
			console.log(group)
			if(insert) {
				Group.findOneAndUpdate({ _id : groupId }, { $push : { users : userInfo }} , { new : true }, function(err, user) {
					console.log(user)
					if(err) {
						console.log(1)
						callBack({ status : "ERROR", msg : err });
						return;
					}

					callBack({ status : "OK", user : filterUser(user)});
				});
			}
			else {
				User.findOneAndUpdate({ _id : groupId }, { $pull : { users : { $in : [{ userId : userId }]}}}, { new : true }, function(err, user) {
					if(err) {
						callBack({ status : "ERROR" });
						return;
					}

					callBack({ status : "OK", group : filterUser(user) });
				});
			}
		})
	})
	
}

/**
 * Function to update groups array of user, as well as users array of his/her drones
 * @param {string} userId - id of user
 * @param {string} groupId - id of group
 * @param {boolean} insert - boolean informing whether users of given drone changed
 * @param {function} callBack - function to return result of updating user groups to
 */
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

/**
 * Admin function to get list of all users
 * @param {string} userId - id of user
 * @param {function} callBack - function to return result of getting user list to
 */
exports.getUserList = function(userId, callBack) {
	if(!userId){
		callBack({ status: "ERROR", msg: "User ID can't be null"});
		return;
	}

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