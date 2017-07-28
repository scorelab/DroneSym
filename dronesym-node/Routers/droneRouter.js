var express = require('express');
var passport = require('passport');
var drones = require('../Controllers/droneCtrl');
var userCtrl = require('../Controllers/userCtrl');
var router = express.Router();

var authenticate = passport.authenticate('jwt', { session: false });
var authorize = userCtrl.authorizeUser;

router.post('/create', authenticate, authorize(['admin']), function(req, res){
	drones.createDrone(req.body, function(response){
		res.json(response);
	});
});

router.get('/get', function(req, res){
	drones.getDroneIds(function(ids){
		res.json({ "status" : "OK", "drones": ids });
	});
});

router.get('/get/:id', function(req, res){
	drones.getDroneById(req.params.id, function(drone){
		res.json(drone);
	});
});

router.post('/update/:id', function(req, res){
	drones.updateDroneStatus(req.params.id, req.body);
	res.json({ status: "OK" });
});

router.post('/takeoff/:id', authenticate , authorize(['admin', 'user']), function(req, res){
	var waypoints = req.body.waypoints;

	drones.takeoffDrone(req.params.id, waypoints, function(status){
		res.json(status);
	});
});

router.post('/land/:id', authenticate, authorize(['admin', 'user']), function(req, res){
	var droneId = req.params.id;

	drones.landDrone(droneId, function(status){
		res.json(status);
	})
});

router.post('/update/waypoints/:id', authenticate, authorize(['admin', 'user']), function(req, res){
	var droneId = req.params.id;
	var waypoints = req.body.waypoints;

	drones.updateWaypoints(droneId, waypoints, function(status){
		console.log(status);
		res.json(status);
	});
});

router.post('/resume/:id', authenticate, authorize(['admin', 'user']), function(req, res){
	var droneId = req.params.id;
	drones.resumeFlight(droneId, function(status){
		res.json(status);
	});
})
module.exports = router;