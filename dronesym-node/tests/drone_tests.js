
const assert = require('assert');
const randomstring = require('randomstring');
const {createUser} = require('../Controllers/userCtrl');
const user = ['', '', ''];// User Array
// eslint-disable-next-line require-jsdoc
function newUser(leng = 10, user) {
  // takes variable argument length, default is 10
  user[0] = randomstring.generate(leng);// Username
  user[1] = randomstring.generate(leng);// Password
  user[2] = 'User';// User
  user[3] = 'test@test.com'; // Email
}

describe('USER CONTROLLER', () => {
  describe('New User', () => {
    describe('Successfully Created', () => {
      before(() => {
        newUser(10, user);
      });
      it('No Missing Requirements. Success.', (done) => {
        createUser(user[0], user[3], user[1], user[2], function(response) {
          assert.strictEqual(response.status, 'OK');
          done();
        });
      });
    });
    describe('Throws Errors', () => {
      newUser(10, user);
      it('Username and Password Missing', (done) => {
        createUser('', user[3], '', user[2], function(response) {
          assert.strictEqual(response.status, 'ERROR');
          done();
        });
      });
      it('Username Missing', (done) => {
        createUser('', user[3], user[1], user[2], function(response) {
          assert.strictEqual(response.status, 'ERROR');
          done();
        });
      });
      it('Password Missing', (done) => {
        createUser(user[0], user[3], '', user[2], function(response) {
          assert.strictEqual(response.status, 'ERROR');
          done();
        });
        it('Email Missing', (done) => {
          createUser(user[0], '', user[1], user[2], function(response) {
            assert.strictEqual(response.status, 'ERROR');
            done();
          });
        });
      });
    });
  });
});
