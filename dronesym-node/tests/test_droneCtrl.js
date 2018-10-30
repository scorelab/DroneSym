const assert = require('assert');

const randomlocation = require('random-location');
const randomstring = require('randomstring');

const {createDrone, getDroneIds} = require('../Controllers/droneCtrl');


function generateName() {
    return randomstring.generate(10);
}
   

function generateLocation(){

const P = {
  latitude: 37.7768006,
  longitude: -122.4187928
}
 
const R = 500 // meters
 
const location = randomlocation.randomCirclePoint(P, R)

return {
     latitude : location.latitude , 
     longitude: location.longitude
};
}

describe("Drone Control", function() {

    describe("Create a Drone", function() {

        describe("Everything Ok", function() {

            it("Contains all params", function(done) {

                const name = generateName();
                const location = generateLoction();

                createDrone(name, location, 'abcdsampleuser', function(response){
                    assert.strictEqual(response.status, 'OK');
                    done();
                });
            });
        });

        describe("Errors", function() {
            it("Missing Name", function(done) {
                const loc = generateLoc();
                createDrone('', location, 'abcdsampleuser', function(response){
                    assert.strictEqual(response.status, 'ERROR');
                    done();
                });
            });
            it("Missing location", function(done) {
                const name = generateName();
                createDrone(name, [], 'abcdsampleuser', function(response){
                    assert.strictEqual(response.status, 'ERROR');
                    done();
                });
            });
        });
    })    
})
