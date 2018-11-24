var request = require('request');
var io = require('../websocket').connection;
var Group = require('../Models/group');
var User = require('../Models/user');
var db = require('../example.db');

var droneRef = db.ref('/drones');

var flaskUrl = 'http://localhost:5000/dronesym/api/flask';

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

exports.getGroups = function(userId, callBack){
	Group.find({ userId : userId }, function(err, groups){
		if(err){
			callBack({ status : "ERROR", msg: err });
			return;
		}
		callBack({ status : "OK", groups : groups });
	});
}

exports.addToGroup = function(groupId, drones, callBack){
	Group.findOneAndUpdate({ _id : groupId }, { $push : { drones : { $each : drones }}}, { new : true }, function(err, group){
		if(err){
			callBack({ status : "ERROR", msg : err });
			return;
		}
		callBack({ status : "OK", group : group});
	});
}

exports.removeFromGroup = function(groupId, droneId, callBack){
	Group.findOneAndUpdate({ _id : groupId }, { $pull : { drones : droneId }}, { new : true }, function(err, group){
		if(err){
			callBack({ status : "ERROR", msg : err });
			return;
		}
		callBack({ status : "OK", group : group });

	});
}

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

exports.takeoffDrone = function(id, waypoints, callBack){
	var waypoints = waypoints || [];

	request.post(`${flaskUrl}/${id}/takeoff`, { json: { waypoints: waypoints }},
		function(err, response, body){
			callBack(body);
		}
	);
}

exports.landDrone = function(id, callBack){
	request.post(`${flaskUrl}/${id}/land`, function(err, response, body){
		callBack(body);
	});
}

exports.resumeFlight = function(id, callBack){
	console.log('resuming...');
	request.post(`${flaskUrl}/${id}/resume`, function(err, response, body){
		callBack(body);
	});
}