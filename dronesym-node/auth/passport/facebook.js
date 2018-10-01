const FacebookStrategy = require('passport-facebook').Strategy
const creds = require('../../config/credentials')
const User = require('../../Models/user')

module.exports = new FacebookStrategy({
  clientID: creds.facebook.clientID,
  clientSecret: creds.facebook.clientSecret,
  callbackURL: creds.facebook.callbackURL,
  passReqToCallback: true,
  profileFields: creds.facebook.profileFields
}, async (req, authToken, refreshToken, profile, done) => {

    let data = profile._json

    if (req.user) {
      //Already logged in user trying to connect, check whether already connected
      const fbaccount = await User.findOne({'facebook.id': data.id})

      if (fbaccount) {
        throw new Error('Your facebook account is already connected')
      }
      else {
        const update = await User.findOne({id: req.user.id})

        if (update) {
          update.facebook.id = data.id;
          update.facebook.username = data.first_name;
          update.facebook.email = data.email;
          update.facebook.authToken = authToken;
          update.facebook.refreshToken = refreshToken;
        }
        await update.save()

        const user = await User.findOne({'facbook.id': data.id})

        // if (err) {
        //   return done(err)
        // }
        if (!user) {
          return done(null, false, {message:'failure'})
        }
        if (user) {
          return done(null, user, {message:'success'})
        }
      }
    }
    else {
      //New login or signup
      
      const user = User.findOne({'facebook.id': data.id})
      //user logged in, if exists

      // if (err) {
      //   return done(err)
      // }
      if (!user) {
        const users = await User.find({'facebook.email': data.email})
        
        if (users && users.length > 0) {
          return done(null, false, {message:'Account having this email already exists, please log into your account and connect to facebook there instead'})
        }
        
        let newFB = new User({
          facebook: {
              id: data.id,
              username: data.first_name,
              email: data.email,
              authToken: authToken,
              refreshToken: refreshToken
          }
        })
        newFB.save()
        //new signup
        const authed = await User.findOne({'facebook.id': data.id})
        
        if(!authed){
          return done(null, false, {message: 'Authentication failed'})
        }
        else {
          return done(null, authed)
        }
      }
      else {
        return done(null, user)
      }
    }
})