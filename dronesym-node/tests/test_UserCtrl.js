const assert = require('assert');

const randomstring = require('randomstring');

const {createUser} = require('../Controllers/userCtrl');

function generateName() {
    return randomstring.generate(10);
}

describe("User Control", function() {

    describe("Create a User", function() {

        describe("Everything Ok", function() {

            it("Contains all params", function(done) {

                const name = generateName();
                const pass = generateName;

                createUser(name, pass, 'User', function(response){
                    assert.strictEqual(response.status, 'OK');
                    done();
                });
            });
        });

        describe("Errors", function() {
            it("Missing Name", function(done) {
                const pass = generateName();
                createUser('', pass, 'User', function(response){
                    assert.strictEqual(response.status, 'ERROR');
                    done();
                });
            });
            it("Missing Password", function(done) {
                const name = generateName();
                createDrone(name, [], 'User', function(response){
                    assert.strictEqual(response.status, 'ERROR');
                    done();
                });
            });
        });
    })    
})
