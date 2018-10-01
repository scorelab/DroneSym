const passport = require('passport')

const github = require('./passport/github')
const facebook = require('./passport/facebook')
const google = require('./passport/google')
const User = require('../Models/user')

passport.use(github)
passport.use(facebook)
passport.use(google)

passport.serializeUser((user, done) => {
  done(null, user)
})

passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(err, user)
  })
})

passport.transformAuthInfo((info, done) => done(null, info))

module.exports = passport