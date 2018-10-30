let mocha = require("mocha");
let assert = require("assert");
let randomstring = require("randomstring");
let randomlocation = require("random-location");

let {createDrone, getDroneIds, removeDrone} = require("../Controllers/droneCtrl");

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

describe("DRONE CONTROLLER", () => {
    describe("Create drone", () => {
        describe("Happy path", () => {
            it("Contains all needed params", (done) => {
                const name = generateDroneName();
                const loc = generateDroneLoc();
                createDrone(name, loc, "597073ad587a6615c459e2bf", function(response){
                    assert.strictEqual(response.status, "OK");
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
        let droneId;
        beforeEach( (done) => {
            const name = generateDroneName();
            const loc = generateDroneLoc();
            createDrone(name, loc, "597073ad587a6615c459e2bf", function(response){
                getDroneIds((result) => {
                    droneId = result[result.length - 1];
                    done();
                });
            });
        })
        describe("Happy path", () => {
            it("Contains all needed params and drone not flying", (done) => {
                removeDrone(droneId, "IDLE", (result) => {
                    assert.strictEqual(result.status, "OK");
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
})