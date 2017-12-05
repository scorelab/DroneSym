const supertest = require("supertest"),
      should = require("should");

const server = supertest.agent("http://localhost:3000");

describe("user tests", () => {
  it("should not allow a user to login without a password", (done) => {
    server
    .post("/dronesym/api/node/user/login")
    .expect(200)
    .end(function(err, res) {
      res.body.status.should.equal("ERROR");
      done();
    });
  });

  it("should not allow a user to be created without authorization", (done) => {
    server
    .post("/dronesym/api/node/user/create")
    .expect(401)
    .end(function(err, res) {
      res.status.should.equal(401);
      done();
    });
  });
});
