/* eslint-disable require-jsdoc */
const assert = require('assert');
const randomstring = require('randomstring');
const randomlocation = require('random-location');
require('dotenv').config();
const ref = require('../example.db').ref('/drones');
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_URL, {useNewUrlParser: true});

const Drone = require('../Models/drone');

const {createDrone, getDroneIds, removeDrone, getDroneById, updateWaypoints, updateDroneStatus} =
require('../Controllers/droneCtrl');

function generateDroneName() {
  return randomstring.generate(10);
}
function checkWaypointsSame(arr1, arr2) {
  for (let i = 0; i < arr1.length; i++) {
    if (arr1[i].lat !== arr2[i].lat || arr1[i].lon !== arr2[i].lon) {
      return false;
    }
  }

  return true;
}
function generateDroneLoc() {
  const P = {
    latitude: 52.237049,
    longitude: 21.017532,
  };

  const R = 5000;

  const location = randomlocation.randomCirclePoint(P, R);

  return {
    lat: location.latitude,
    lon: location.longitude,
  };
}
function genWaypoints(num) {
  const waypoints = [];
  for (let i = 0; i < num; i++) {
    waypoints.push(generateDroneLoc());
  }

  return waypoints;
}
function getLastDroneId(callBack) {
  getDroneIds((result) => {
    const droneId = result[result.length - 1];
    callBack(droneId);
  });
}

describe('DRONE CONTROLLER', () => {
  describe('Create drone', () => {
    describe('Happy path', () => {
      let name; let loc; let des; let flying;
      before( () => {
        name = generateDroneName();
        loc = generateDroneLoc();
        des = 'Test Desc';
        flying = '1H';
      });
      it('Contains all needed params', (done) => {
        createDrone(name, des, flying, loc, '597073ad587a6615c459e2bf',
            function(response) {
              assert.strictEqual(response.status, 'OK');
              done();
            });
      });
    });
    describe('Should throw errors', () => {
      it('Doesn\'t contain name', (done) => {
        const loc = generateDroneLoc();
        createDrone('', 'Test Desc', '1H', loc, '597073ad587a6615c459e2bf',
            function(response) {
              assert.strictEqual(response.status, 'ERROR');
              done();
            });
      });
      it('Doesn\'t contain location', (done) => {
        const name = generateDroneName();
        createDrone(name, 'Test Desc', '1H', [], '597073ad587a6615c459e2bf',
            function(response) {
              assert.strictEqual(response.status, 'ERROR');
              done();
            });
      });
      it('Location has only one dimension', (done) => {
        const name = generateDroneName();
        const loc = {'lat': 52.237049};
        createDrone(name, 'Test Desc', '1H', loc, '597073ad587a6615c459e2bf',
            function(response) {
              assert.strictEqual(response.status, 'ERROR');
              done();
            });
      });
    });
  });
  describe('Update waypoints', () => {
    let droneId; let name; let waypoints;
    before( (done) => {
      name = generateDroneName();
      const loc = generateDroneLoc();
      createDrone(name, 'Test Desc', '1H', loc, '597073ad587a6615c459e2bf', function(response) {
        getLastDroneId((result) => {
          droneId = result;
          done();
        });
        waypoints = genWaypoints(2);
      });
    });
    it('Update waypoints - check response', (done) => {
      updateWaypoints(droneId, waypoints, function(result) {
        assert.strictEqual(result.status, 'OK');
        done();
      });
    });
    it('Update waypoints - check database', (done) => {
      Drone.findOne({_id: droneId}).select({'waypoints': 1, '_id': 0}).then(function(snapshot) {
        assert(checkWaypointsSame(snapshot, waypoints));
        done();
      }).catch((error) => {
        assert.fail('Fetch failed from DB' + error);
        done();
      });
    });
  });

  describe('Update Drone Status', () => {
    let droneStatus; let droneId;
    const statuses = ['FLYING', 'IDLE'];
    before( (done) => {
      name = generateDroneName();
      const loc = generateDroneLoc();
      createDrone(name, 'Test Desc', '1H', loc, '597073ad587a6615c459e2bf', function(response) {
        getLastDroneId((result) => {
          droneId = result;
          done();
        });
      });
      droneStatus = statuses[Math.floor(Math.random() * statuses.length)];
    });
    it('Update drone status - Result', (done) => {
      updateDroneStatus(droneId, droneStatus, (result) => {
        assert.strictEqual(result.status, 'OK');
        done();
      });
    });
    it('Update drone status - DB check', (done) => {
      Drone.findOne({_id: droneId}).select({'waypoints': 1, '_id': 0}).then(function(snapshot) {
        assert(strictEqual(snapshot, droneStatus));
        done();
      }).catch((error) => {
        assert.fail('Fetch failed from DB' + error);
        done();
      });
      done();
    });
  });
  describe('Remove drone', () => {
    let droneId; let name; let deletedDroneName;
    beforeEach( (done) => {
      name = generateDroneName();
      const loc = generateDroneLoc();
      createDrone(name, 'Test Desc', '1H', loc, '597073ad587a6615c459e2bf',
          function(response) {
            getLastDroneId((result) => {
              droneId = result;
              done();
            });
          });
    });
    describe('Happy path', () => {
      it('Contains all needed params and drone not flying', (done) => {
        deletedDroneName = droneId;
        removeDrone(droneId, 'IDLE', (result) => {
          assert.strictEqual(result.status, 'OK');
          done();
        });
      });
    });
    describe('Should throw errors', () => {
      it('Drone is flying', (done) => {
        removeDrone(droneId, 'FLYING', (result) => {
          assert.strictEqual(result.status, 'ERROR');
          done();
        });
      });
      it('Doesn\'t contain droneId', (done) => {
        removeDrone('', 'IDLE', (result) => {
          assert.strictEqual(result.status, 'ERROR');
          done();
        });
      });
    });
  });
  describe('Get all drones', () => {
    describe('Happy path', () => {
      it('Returns all drones', (done) => {
        getDroneIds((result) => {
          assert(result);
          done();
        });
      });
    });
  });
  describe('Get drone by id', () => {
    describe('Happy path', () => {
      let droneId;
      before( (done) => {
        getLastDroneId((result) => {
          droneId = result;
          done();
        });
      });
      it('Returns a drone', (done) => {
        getDroneById(droneId, (result) => {
          assert(result);
          done();
        });
      });
    });
    describe('Should throw errors', () => {
      it('Doesn\'t contain droneId', (done) => {
        getDroneById('', (result) => {
          assert.strictEqual(result.status, 'ERROR');
          done();
        });
      });
    });
  });
});
