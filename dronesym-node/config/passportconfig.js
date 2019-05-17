const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const jwtConfig = require('./jwtconfig');
const User = require('../Models/user');

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('jwt'),
  secretOrKey: jwtConfig.secret,
};

const jwtAuthenticate = new JwtStrategy(jwtOptions, function(payload, done) {
  User.findById(payload.id, function(err, user) {
    if (err) {
      done(err);
      return;
    }

    if (user) {
      done(null, user);
    } else {
      console.log('User not found');
      done(null, false);
    }
  });
});

module.exports = function(passport) {
  passport.use(jwtAuthenticate);
};
