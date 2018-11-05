var request = require('request');
var io = require('../websocket').connection;
var Group = require('../Models/group');
var User = require('../Models/user');
var db = require('../example.db');

var droneRef = db.ref('/drones');

var flaskUrl = 'http://localhost:5000/dronesym/api/flask';

/**
 * Function to send drone data to browser of user
 * @param {object} snapshot - object containing information about every drone 
 * @param {string} socket - id of socket
 */
var sendSnapsot = function(snapshot,socket){
  var array = [];
  var userId = socket.decoded_token.id;

  snapshot.forEach(function(item){
    let drone = item.val();

    let droneUsers = drone.users.map(function(user) {
    	return user.userId;
    });

    if(droneUsers.indexOf(userId) == -1){
        return;
    }

    drone['key'] = item.key;
    delete drone['users'];

    array.push(drone);
  });

  socket.emit('SOCK_FEED_UPDATE', array);
}

if(process.env.NODE_ENV !== "test"){
	io.on('connection', function(socket){
		console.log('FEED_SUBSCRIPTION');
		var userId = socket.decoded_token.id;

		socket.emit('hello', userId);

		//Initial drone data sent to client on first connection
		droneRef.once("value", function(snapshot){
			sendSnapsot(snapshot, socket);
		})

		droneRef.on("value", function(snapshot){
			sendSnapsot(snapshot, socket);
		})
	});
}
//Send update drone data upon change to firebase

/**
 * Creates drone with given data
 * @param {string} name - name of drone
 * @param {object} location - object containing lat and lon values
 * @param {string} userId - id of person who is owner of that drone
 * @param {function} callBack - function to return result of creating drone
 */
exports.createDrone = function(name, location, userId, callBack){
	if(!name  || name === ''){
		callBack({ status : "ERROR", msg: "Drone name is required"});
		return;
	}
	
	if(!location || Object.keys(location).length !== 2){
		callBack({ status: "ERROR", msg: "Drone location is required"});
		return;
	}

	var droneKey = droneRef.push({'name': name, 'users' : [ { userId : userId, groupId : "creator" }], 'location': location, 'waypoints': [location] })

	request.post(`${flaskUrl}/spawn`, { json : { droneId: droneKey.key, location: location } },
	function(error, response, body){
		callBack(body);
	})
}

/**
 * Removes drone from firebase database and group drones
 * @param {string} droneId - id of drone
 * @param {string} droneStatus - status of drone (can't remove drone in middle of flight)
 * @param {function} callBack - function to return result of removing drone to
 */
exports.removeDrone = function(droneId, droneStatus, callBack){
	if(droneStatus === "FLYING"){
		callBack({ status : "ERROR", msg : "Drone in flight"});
		return;
	}

	if(!droneId || droneId === ""){
		callBack({ status : "ERROR", msg : "Drone ID not provided"});
		return;
	}

	var removeFromGroups = function(droneId){
		Group.update({ drones : { $in : [droneId]}}, { $pull : { drones : droneId }}, { multi : true }, function(err, group){
			if(err){
				console.log(err);
				return;
			}
		})
	}

	request.post(`${flaskUrl}/remove/${droneId}`, {}, function(error, response, body){
		if(error){
			callBack({ status : "ERROR", msg : "Connection error"});
			return;
		}

		removeFromGroups(droneId);
		droneRef.child(droneId).remove((error) => {
			if(error) {
				callBack({ status: "ERROR", msg: "Removal error"});
				return;
			}

			callBack(JSON.parse(body));
		});
	})
}

/**
 * Creates a new group
 * @param {string} groupName - unique name of group
 * @param {string} userId - id of owner of that group
 * @param {function} callBack - function to return result of creating group to
 */
exports.createGroup = function(groupName, userId, callBack){
	if(!groupName || groupName === ""){
		callBack( { status : "ERROR", msg: "Group name must be specified"});
		return;
	}

	Group.find({ name : groupName }, function(err, groups){
		if(groups.length > 0){
			callBack({ status : "ERROR", msg : "Group Exists"});
			return;
		}


		var group = new Group();
		group.name = groupName;
		group.userId = userId;

		group.save(function(err, group){
			if(err){
				callBack({ status : "ERROR", msg : err })
				return;
			}

			callBack({ status : "OK", group : group });
		})
	})
}

/**
 * Removes a group
 * @param {string} groupId - id of owner of that group
 * @param {function} callBack - function to return result of removing group to
 */
exports.removeGroup = function(groupId, callBack){
	Group.findOneAndRemove({ _id : groupId }, function(err, group){
		if(err){
			callBack({ status : "ERROR", msg : err });
			return;
		}

		User.update({}, { $pull : { groups : { $in : { groupId : groupId }}}}, function(err, group) {
			if(err) {
				callBack({ status : "ERROR", msg : err });
				return;
			}

			callBack({ status : "OK", group : group });
		});
	});
}

/**
 * Gets list of groups of user 
 * @param {string} userId - id of user
 * @param {function} callBack - function to return result of getting group to
 */
exports.getGroups = function(userId, callBack){
	Group.find({ userId : userId }, function(err, groups){
		if(err){
			callBack({ status : "ERROR", msg: err });
			return;
		}
		callBack({ status : "OK", groups : groups });
	});
}

/**
 * Adds drones to group 
 * @param {string} groupId - id of group
 * @param {array} drones - array of drone objects
 * @param {function} callBack - function to return result of adding drones to
 */
exports.addToGroup = function(groupId, drones, callBack){
	Group.findOneAndUpdate({ _id : groupId }, { $push : { drones : { $each : drones }}}, { new : true }, function(err, group){
		if(err){
			callBack({ status : "ERROR", msg : err });
			return;
		}
		callBack({ status : "OK", group : group});
	});
}

/**
 * Removes drone with given ids from group 
 * @param {string} groupId - id of group
 * @param {string} droneId - id of drone
 * @param {function} callBack - function to return result of removing drone to
 */
exports.removeFromGroup = function(groupId, droneId, callBack){
	Group.findOneAndUpdate({ _id : groupId }, { $pull : { drones : droneId }}, { new : true }, function(err, group){
		if(err){
			callBack({ status : "ERROR", msg : err });
			return;
		}
		callBack({ status : "OK", group : group });

	});
}

/**
 * Updates waypoints of given drone 
 * @param {string} id - id of drone
 * @param {array} waypoints - array of locations - lat, lon objects
 * @param {function} callBack - function to return result of adding waypoints to
 */
exports.updateWaypoints = function(id, waypoints, callBack){
  var waypointsRef = droneRef.child(id).child('waypoints');

  waypointsRef.set(waypoints, function(err){
    if(err){
      callBack({ status: "ERROR", msg: err });
      return;
    }
    callBack({ status: "OK" });
  });
}

/**
 * Gets drone ids of all drones
 * @param {function} callBack - function to return result of getting drone ids to
 */
exports.getDroneIds = function(callBack){
	var drones = [];

	droneRef.orderByKey().once("value")
	.then(function(snapshot){
		snapshot.forEach(function(drone){
			drones.push(drone.key);
		});
		callBack(drones);
	});
}

/**
 * Updates drone status 
 * @param {string} id - id of drone
 * @param {string} status - status to update drone to, every update has its timestamp
 * @param {function} callBack - function to return result of updating drone status to
 */
exports.updateDroneStatus = function(id, status, callBack){
	var timestamp = new Date();
	status["timestamp"] = timestamp.valueOf();
	droneRef.child(id).update(status, function(err){
		if(err){
			console.log(err);
			return;
		}
		callBack({ status : "OK", update : status });
	});
}

/**
 * Gets drone params by its id 
 * @param {string} id - id of drone
 * @param {function} callBack - function to return result of getting drone params to
 */
exports.getDroneById = function(id, callBack){
	if(!id || id === ""){
		callBack({ status : "ERROR", msg : "Id must be specified"});
		return;
	}
	
	droneRef.orderByKey().equalTo(id)
	.once("value", function(snapshot){
		callBack(snapshot.child(id));
	});
}

/**
 * Takeoffs drone on journey of several waypoints 
 * @param {string} id - id of drone
 * @param {array} waypoints - array of objects containing lat lon points, that drone will fly towards
 * @param {function} callBack - function to return result of takeoffing drone to
 */
exports.takeoffDrone = function(id, waypoints, callBack){
	var waypoints = waypoints || [];

	request.post(`${flaskUrl}/${id}/takeoff`, { json: { waypoints: waypoints }},
		function(err, response, body){
			callBack(body);
		}
	);
}

/**
 * Lands drone, stops its flight
 * @param {string} id - id of drone
 * @param {function} callBack - function to return result of updating drone status to
 */
exports.landDrone = function(id, callBack){
	request.post(`${flaskUrl}/${id}/land`, function(err, response, body){
		callBack(body);
	});
}

/**
 * Resumes flight of drone 
 * @param {string} id - id of drone
 * @param {function} callBack - function to return result of resuming drone flight to
 */
exports.resumeFlight = function(id, callBack){
	console.log('resuming...');
	request.post(`${flaskUrl}/${id}/resume`, function(err, response, body){
		callBack(body);
	});
}