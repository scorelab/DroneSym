var express = require('express');
var passport = require('passport');
var drones = require('../Controllers/droneCtrl');
var userCtrl = require('../Controllers/userCtrl');
var router = express.Router();

var authenticate = passport.authenticate('jwt', { session: false });
var authorize = userCtrl.authorizeUser;

router.post('/create', authenticate, authorize(['admin']), function(req, res){
	var drone = req.body;
	drones.createDrone(drone.name, drone.location, req.user.id, function(response){
		res.json(response);
	});
});

router.post('/remove/:id', authenticate, authorize(['admin']), function(req, res){
	var drone = req.body;
	console.log(drone);

	drones.removeDrone(req.params.id, drone.status, function(status){
		res.json(status);
	});
})

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
	drones.updateDroneStatus(req.params.id, req.body, function(status){
		res.json(status);
	});
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

router.post('/groups/create', authenticate, authorize(['admin']), function(req, res){
	drones.createGroup(req.body.name, req.user.id, function(status){
		res.json(status);
	})
})

router.post('/groups/remove/:id', authenticate, authorize(['admin']), function(req, res){
	drones.removeGroup(req.params.id, function(status){
		res.json(status);
	})
})

router.get('/groups', authenticate, function(req, res){
	drones.getGroups(req.user.id, function(status){
		res.json(status);
	})
})


router.post('/groups/:id/add', authenticate, function(req, res){
	drones.addToGroup(req.params.id, req.body.drones, function(status){
		res.json(status);
	})
})

router.post('/groups/:id/remove/:droneId', authenticate, function(req, res){
	drones.removeFromGroup(req.params.id, req.params.droneId, function(status){
		res.json(status);
	})
})

module.exports = router;