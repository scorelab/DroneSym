let mocha = require("mocha");
let assert = require("assert");
let randomstring = require("randomstring");
let randomlocation = require("random-location");
var ref = require("../example.db").ref("/drones");

let {createDrone, getDroneIds, removeDrone, getDroneById, updateWaypoints, updateDroneStatus} = require("../Controllers/droneCtrl");

function generateDroneName() {
    return randomstring.generate(10);
}   

function waypointsSame(arr1, arr2) {
    if(arr1.length !== arr2.length) {
        return false;
    }
    for(var i = 0; i < arr1.length; i++) {
        if(arr1[i].lat !== arr2[i].lat) {
            return false;
        }
        if(arr1[i].lon !== arr2[i].lon) {
            return false;
        }
    }

    return true;
}

function generateDroneLoc() {
    const P = {
        latitude: 52.237049,
        longitude: 21.017532
    };

    const R = 5000;

    const location = randomlocation.randomCirclePoint(P, R);

    return {
        lat: location.latitude,
        lon: location.longitude
    };
}

function getLastDroneId(callBack) {
    getDroneIds((result) => {
        let droneId = result[result.length - 1];
        callBack(droneId);
    });
}
// num - number of waypoints to be generated
function generateWaypoints(num) {
    // waypoint format - [ {
    //    "lat" : 52.24792509995484,
     //   "lon" : 21.047667292559048
     //  } ]
    let waypoints = [];
    for (var i = 0; i < num; i++) {
        waypoints.push(generateDroneLoc());
    }
    
    return waypoints;
}

describe("DRONE CONTROLLER", () => {
    describe("Create drone", () => {
        describe("Happy path", () => {
            let name, loc;
            before( () => {
                name = generateDroneName();
                loc = generateDroneLoc();
            });
            it("Contains all needed params", (done) => {
                createDrone(name, loc, "597073ad587a6615c459e2bf", (response) => {
                    assert.strictEqual(response.status, "OK");
                    done();
                });
            });
            it("Creates entry in firebase database", (done) => {
                ref.orderByKey().once("value")
                .then(function(snapshot){
                    snapshot = snapshot.val();
                    snapshot = Object.values(snapshot);
                    let names = snapshot.map((drone) => drone.name);
                    assert(names.includes(name));
                    done();
                });
            });
        });
        describe("Should throw errors", () => {
            it("Doesn't contain name", (done) => {
                const loc = generateDroneLoc();
                createDrone("", loc, "597073ad587a6615c459e2bf", function(response){
                    assert.strictEqual(response.status, "ERROR");
                    done();
                });
            });
            it("Doesn't contain location", (done) => {
                const name = generateDroneName();
                createDrone(name, [], "597073ad587a6615c459e2bf", function(response){
                    assert.strictEqual(response.status, "ERROR");
                    done();
                });
            });
            it("Location has only one dimension", (done) => {
                const name = generateDroneName();
                const loc = {"lat": 52.237049};
                createDrone(name, loc, "597073ad587a6615c459e2bf", function(response){
                    assert.strictEqual(response.status, "ERROR");
                    done();
                });
            });
        });
    });
    describe("Remove drone", () => {
        let droneId, name;
        beforeEach( (done) => {
            name = generateDroneName();
            const loc = generateDroneLoc();
            createDrone(name, loc, "597073ad587a6615c459e2bf", function(response){
                getLastDroneId((result) => {
                    droneId = result;
                    done();
                });
            });
        });
        describe("Happy path", () => {
            it("Contains all needed params and drone not flying", (done) => {
                removeDrone(droneId, "IDLE", (result) => {
                    assert.strictEqual(result.status, "OK");
                    done();
                });
            });
            /* it('Deletes drone fron firebase', (done) => {
                ref.orderByKey().once("value")
                .then(function(snapshot){
                    snapshot = snapshot.val();
                    snapshot = Object.values(snapshot);
                    let names = snapshot.map(drone => drone.name);
                    console.log(name, names);
                    assert(!names.includes(name));
                    done();
                });
            }) */
        });
        describe("Should throw errors", () => {
            it("Drone is flying", (done) => {
                removeDrone(droneId, "FLYING", (result) => {
                    assert.strictEqual(result.status, "ERROR");
                    done();
                });
            });
            it("Doesn't contain droneId", (done) => {
                removeDrone("", "IDLE", (result) => {
                    assert.strictEqual(result.status, "ERROR");
                    done();
                });
            });
        });
    });    
    describe("Get all drones", () => {
        describe("Happy path", () => {
            it("Returns all drones", (done) => {
                getDroneIds((result) => {
                    assert(result);
                    done();
                });
            });
        });
    });
    describe("Get drone by id", () => {
        describe("Happy path", () => {
            let droneId;
            before( (done) => {
                getLastDroneId((result) => {
                    droneId = result;
                    done();
                });
            });
            it("Returns a drone", (done) => {
                getDroneById(droneId, (result) => {
                    assert(result);
                    done();
                });
            });
        });
        describe("Should throw errors", () => {
            it("Doesn't contain droneId", (done) => {
                getDroneById("", (result) => {
                    assert.strictEqual(result.status, "ERROR");
                    done();
                });
            });
        });
    });
    describe("Update waypoints", () => {
        let droneId, name, waypoints;
        before( (done) => {
            name = generateDroneName();
            const loc = generateDroneLoc();
            createDrone(name, loc, "597073ad587a6615c459e2bf", function(response){
                getLastDroneId((result) => {
                    droneId = result;
                    done();
                });
            waypoints = generateWaypoints(2);
            });
        });
        it("Update waypoints - check response", (done) => {
            updateWaypoints(droneId, waypoints, (result) => {
                assert.strictEqual(result.status, "OK");
                done();
            });
        });
        it("Update waypoints - check database", (done) => { 
            ref.child(droneId).child('waypoints').once('value').then(function(snapshot) {
                assert(waypointsSame(snapshot.val(), waypoints));
                done();
            }).catch((error) => {
                console.log(error);
                assert.isNotOk(error,'Promise error');
                done();
            });
        });
    });
    describe("Update Drone Status", () => {
        let droneStatus, droneId;
        let possible_status = ['FLYING','IDLE'];
        before( (done) => {
            name = generateDroneName();
            const loc = generateDroneLoc();
            createDrone(name, loc, "597073ad587a6615c459e2bf", function(response){
                getLastDroneId((result) => {
                    droneId = result;
                    done();
                });
            });
            droneStatus = possible_status[Math.floor(Math.random() * possible_status.length)];
        });
        it("Update drone status - check response", (done) => {
            updateDroneStatus(droneId, droneStatus, (result) => {
                assert.strictEqual(result.status, "OK");
                done();
            });
        });
        it("Update drone status - check database", (done) => {
            ref.child(droneId).child('status').once('value').then(function(snapshot) {
                assert.strictEqual(snapshot.val(), droneStatus);
                done();
            });
            
        });
    });
});
