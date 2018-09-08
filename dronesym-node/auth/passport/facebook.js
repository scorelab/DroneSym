const FacebookStrategy = require('passport-facebook').Strategy
const creds = require('../../config/credentials')
const User = require('../../Models/user')

module.exports = new FacebookStrategy({
  clientID: creds.facebook.clientID,
  clientSecret: creds.facebook.clientSecret,
  callbackURL: creds.facebook.callbackURL,
  passReqToCallback: true,
  profileFields: creds.facebook.profileFields
}, async (req, authToken, profile, done) => {
    
    let data = profile._json
    let oldUser = req.user
    
    if (oldUser) {
      //Already logged in user trying to login, check whether already in session
      const fbaccount = await User.findOne({'facebook.id': data.id})
      
      if (fbaccount) {
        console.log('Already logged in, fetching account')
      }
      else {
        const update = await User.findOne({'facebook.id': data.id})

        if (update) {
          update.facebook.id = data.id;
          update.facebook.username = data.first_name;
          update.facebook.email = data.email;
          update.facebook.accessToken = accessToken;
        }
        await update.save()
        
        const user = await User.findOne({'facbook.id': data.id})
        
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
      const user = User.findOne({'facebook.id': data.id})
      
      if (err) {
        return done(err)
      }
      if (!user) {
        return done(null, false)
      }
      if (user) {
        return done(null, user)
      }
    }
})