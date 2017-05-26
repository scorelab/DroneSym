var express = require('express');
var drones = require('../Controllers/droneCtrl');
var router = express.Router();

router.post('/create', function(req, res){
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

router.post('/takeoff/:id', function(req, res){
	var waypoints = req.body.waypoints;

	drones.takeoffDrone(req.params.id, waypoints, function(status){
		res.json(status);
	});
});

router.post('/land/:id', function(req, res){
	var droneId = req.params.id;

	drones.landDrone(droneId, function(status){
		res.json(status);
	})
});

module.exports = router;