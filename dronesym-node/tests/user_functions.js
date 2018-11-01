let assert = require("assert");

let randomstring = require("randomstring");

var ref = require("../example.db").ref("/drones");

let {createUser} = require("../Controllers/userCtrl");


function generateName() {
    return randomstring.generate(10);
} 

describe("USER CONTROLLER", () => {
    describe("Create user", () => {
        describe("All Okay", () => {
            let name, loc;
            before( () => {
                name = generateName();
                pass = generateName();
            });
            it("Contains all needed params", (done) => {
                createUser(name, pass, "User", function(response){
                    assert.strictEqual(response.status, "OK");
                    done();
                });
            });
        });
        describe("Should throw errors", () => {
            it("Doesn't contain username", (done) => {
                const pass = generateName();
                createUser("", pass, "User", function(response){
                    assert.strictEqual(response.status, "ERROR");
                    done();
                });
            });
            it("Doesn't contain Password", (done) => {
                const name = generateDroneName();
                createUser(name, "", "User", function(response){
                    assert.strictEqual(response.status, "ERROR");
                    done();
                });
            });
        });
    });
});

