var request = require('request');
var io = require('../websocket').connection;
var db = require('../db');

var droneRef = db.ref('/drones');

var flaskUrl = 'http://flask:5000/dronesym/api/flask';

var sendSnapsot = function(snapshot){
  var array = [];

  snapshot.forEach(function(item){
    itemVal = item.val();
    itemVal['key'] = item.key;
    array.push(itemVal);
  });

  io.emit('SOCK_FEED_UPDATE', array);
}

io.on('connection', function(socket){
	console.log('FEED_SUBSCRIPTION');

  //Initial drone data sent to client on first connection
	droneRef.once("value", function(snapshot){
    sendSnapsot(snapshot);
  })
});

//Send update drone data upon change to firebase
droneRef.on("value", function(snapshot){
	sendSnapsot(snapshot);
})

exports.createDrone = function(name, location, callBack){
	if(!name  || name === ''){
		callBack({ status : "ERROR", msg: "Drone name is required"});
		return;
	}

	var droneKey = droneRef.push({'name': name, 'location': location, 'waypoints': [location] });

	request.post(`${flaskUrl}/spawn`, { json : { droneId: droneKey.key, location: location } },
	function(error, response, body){
		console.log(body);
		callBack(body);
	})
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

exports.updateDroneStatus = function(id, status){
	var timestamp = new Date();
	status["timestamp"] = timestamp.valueOf();
	droneRef.child(id).update(status, function(err){
		if(err){
			console.log(err);
			return;
		}
	});
}

exports.getDroneById = function(id, callBack){
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