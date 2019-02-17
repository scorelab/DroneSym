let mocha = require("mocha");
let assert = require("assert");
let randomstring = require("randomstring");

const {createUser, loginUser, getUserList} = require("../Controllers/userCtrl");

const mongoose = require("mongoose");
const mongoConfig = require("../config/example.mongoconfig");
mongoose.connect(mongoConfig.dbUri);

const User = require("../Models/user");

function generateUserData() {
    return {
        username: randomstring.generate(10), 
        password: randomstring.generate(5), 
        role: "user"
    };
}

describe("USER CONTROLLER", () => {
    describe("Create user", () => {
        let username, password, role;
        before(() => {
            ({ username, password, role } = generateUserData());
        });
        describe("Happy path", () => {
            it("Contains all needed params", (done) => {
                createUser(username, password, role, (res) => {
                    assert.strictEqual(res.status, "OK");
                    assert(res.token);
                    done();
                });
            });
            it("Saves user in database", async () => {
                const registeredUser = await User.findOne({uname: username}).exec();
                assert(registeredUser);
            });
        });
        describe("Should throw errors", () => {
            it("Username is null", (done) => {
                createUser("", password, role, (res) => {
                    assert.strictEqual(res.status, "ERROR");
                    assert.strictEqual(res.msg, "Username and password must be specified");
                    done();
                });
            });
            it("Password is null", (done) => {
                createUser(username, "", role, (res) => {
                    assert.strictEqual(res.status, "ERROR");
                    assert.strictEqual(res.msg, "Username and password must be specified");
                    done();
                });
            });
            it("There is already user with given username", (done) => {
                createUser(username, password, role, (res) => {
                    assert.strictEqual(res.status, "ERROR");
                    assert.strictEqual(res.msg, "Username already taken");
                    done();
                });
            });
        });
    });
    describe("Login user", () => {
        let username, password, role;
        before((done) => {
            //creating user for tests
            ({ username, password, role } = generateUserData());
            createUser(username, password, role, (res) => {
                done();
            });
        });
        describe("Happy path", () => {
            it("Contains all needed params and user exists", (done) => {
                loginUser(username, password, (res) => {
                    assert.strictEqual(res.status, "OK");
                    assert.strictEqual(res.role, role);
                    assert(res.token);
                    done();
                });
            });
        });
        describe("Should throw errors", () => {
            it("User doesn't exist", (done) => {
                loginUser("a@a.pl", "a", (res) => {
                    assert.strictEqual(res.status, "ERROR");
                    assert.strictEqual(res.msg, "Invalid username");
                    done();
                });
            });
            it("Username is null", (done) => {
                loginUser("", password, (res) => {
                    assert.strictEqual(res.status, "ERROR");
                    assert.strictEqual(res.msg, "Username and password must be specified");
                    done();
                });
            });
            it("Password is null", (done) => {
                loginUser(username, "", (res) => {
                    assert.strictEqual(res.status, "ERROR");
                    assert.strictEqual(res.msg, "Username and password must be specified");
                    done();
                });
            });
            it("Password is wrong", (done) => {
                loginUser(username, "a", (res) => {
                    assert.strictEqual(res.status, "ERROR");
                    assert.strictEqual(res.msg, "Invalid password");
                    done();
                });
            });
        });
    });
    describe("Get list of users", () => {
        describe("Happy path", () => {
            it("Contains all needed params", (done) => {
                getUserList("597073ad587a6615c459e2bf", (res) => {
                    assert.strictEqual(res.status, "OK");
                    assert.strictEqual(Array.isArray(res.users), true);
                    done();
                });
            });
        });
        describe("Should throw errors", () => {
            it("User ID is null", (done) => {
                getUserList("", (res) => {
                    assert.strictEqual(res.status, "ERROR");
                    assert.strictEqual(res.msg, "User ID can't be null");
                    done();
                });
            });
            //doesn't test when there is only one user
            //I guess deleting whole user db is too bad
            //if anybody has more smart solution, feel free to implement this
        });
    });
});
