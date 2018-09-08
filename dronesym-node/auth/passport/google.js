const GoogleStrategy = require('passport-google-oauth20').Strategy
const creds = require('../../config/credentials')
const User = require('../../Models/user')

module.exports = new GoogleStrategy({
  clientID: creds.google.clientID,
  clientSecret: creds.google.clientSecret,
  callbackURL: creds.google.callbackURL,
  passReqToCallback: true,
  scope: creds.google.scope
}, async (req, accessToken, profile, done) => {
    
    let data = profile._json    
    let oldUser = req.user
    
    if (oldUser) {
      //Already logged in user trying to login, check whether already in session
      const googleaccount = await User.findOne({'google.id': data.id})
      
      if (googleaccount) {
        console.log('Already logged in, fetching account')
      }
      else {
        const update = await User.findOne({'google.id': data.id})
        
        if (update) {
          update.google.id = data.id;
          update.google.username = data.emails[0].value.split('@')[0];
          update.google.email = data.emails[0].value;
          update.google.token = accessToken;
        }
        await update.save()
        
        const user = await User.findOne({'google.id': data.id})
        
        if (err) {
          return done(err)
        }
        if (!user) {
          console.log('Couldn\'t fetch existing user')
          return done(null, false)
        }
        if (user) {
          return done(null, user)
        }
      }
    }
    else {
      //New login
      const user = User.findOne({'google.id': data.id})
      
      if (err) {
        return done(err)
      }
      if (!user) {
        console.log('Register first')
        return done(null, false)
      }
      if (user) {
        return done(null, user)
      }
    }
})