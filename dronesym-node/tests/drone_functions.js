let mocha = require("mocha");
let assert = require("assert");
let randomstring = require("randomstring");
let randomlocation = require("random-location");
var ref = require("../example.db").ref("/drones");

let {createDrone, getDroneIds, removeDrone, getDroneById} = require("../Controllers/droneCtrl");

function generateDroneName() {
    return randomstring.generate(10);
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

describe("DRONE CONTROLLER", () => {
    describe("Create drone", () => {
        describe("Happy path", () => {
            let name, loc;
            before( () => {
                name = generateDroneName();
                loc = generateDroneLoc();
            });
            it("Contains all needed params", (done) => {
                createDrone(name, loc, "597073ad587a6615c459e2bf", function(response){
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
        let droneId, name, deletedDroneName;
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
                deletedDroneName = droneId;
                removeDrone(droneId, "IDLE", (result) => {
                    assert.strictEqual(result.status, "OK");
                    done();
                });
            });
            it("Deletes drone from firebase", (done) => {
                ref.orderByKey().once("value")
                .then(function(snapshot){
                    snapshot = snapshot.val();
                    snapshot = Object.values(snapshot);
                    let names = snapshot.map((drone) => drone.name);
                    assert(!names.includes(deletedDroneName));
                    done();
                });
            });
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
});
import Dronesym from '../../src/js/cli/DroneCLI';

const cli = new Dronesym();

test('Dronesym executes basic help', () => {
  sym.run('help').then(result => expect(result).toMatchSnapshot());
});

test('Dronesym shows help for help command', () => {
  sym.run('help help').then(result => expect(result).toMatchSnapshot());
});

test('Dronesym shows help for invalid command', () => {
  sym.run('fake').then(result => expect(result).toMatchSnapshot());
});

test('Dronesym shows help for invalid help option', () => {
  sym.run('help fake').then(result => expect(result).toMatchSnapshot());
});

const customsym = new Dronesym();
customsym.command(
  'restart [project]', 'Restarts a given build for a project'
)
.option(
  'buildNumber',
  'Optional. Number of the build to restart. Defaults to the last build'
)
.option(
  'anotherOption',
  'Optional. Fake description'
)
.action(() => {
  Promise.resolve('test');
});

test('Dronesym adds a custom command', () => {
  customsym.run('help').then(result => expect(result).toMatchSnapshot());
});

test('Dronesym shows help for a custom command', () => {
  customsym.run('help restart').then(result => expect(result).toMatchSnapshot());
});

test('Dronesym executes action from a custom command', () => {
  const customActionsym = new Dronesym();
  customActionsym.command(
    'restart [project]', 'Restarts a given build for a project'
  ).action(() => Promise.resolve('abc'));

  customActionsym.run('restart').then(result => expect(result).toBe('abc'));
});

test('Dronesym fails for invalid args', () => {
  const customActionsym = new Dronesym();
  customActionsym.command(
    'restart [project]', 'Restarts a given build for a project'
  ).validate(() => 'Invalid');

  customActionsym.run('restart').then(
    () => {}, result => expect(result).toBe('Invalid')
  );
});

test('Dronesym fails for invalid args', () => {
  const customActionsym = new Dronesym();
  customActionsym.command(
    'restart [project]', 'Restarts a given build for a project'
  ).validate(() => true).action(() => Promise.resolve('abc'));

  customActionsym.run('restart').then(result => expect(result).toBe('abc'));
});
