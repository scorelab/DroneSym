var request = require('request');
var io = require('../websocket').connection;
var db = require('../db');

var droneRef = db.ref('/drones');

var flaskUrl = 'http://localhost:5000/dronesym/api/flask';

io.on('connection', function(socket){
	console.log('FEED_SUBSCRIPTION');

  //Initial drone data sent to client on first connection
	droneRef.once("value", function(snapshot){
    io.emit('SOCK_FEED_UPDATE', snapshot);
  })
});

//Send update drone data upon change to firebase
droneRef.on("value", function(snapshot){
	io.emit('SOCK_FEED_UPDATE', snapshot);
})

exports.createDrone = function(location, callBack){
	var droneKey = droneRef.push({'location': location });

	request.post(`${flaskUrl}/spawn`, { json : { droneId: droneKey.key, location: location } },
	function(error, response, body){
		console.log(body);
		callBack(body);
	})
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