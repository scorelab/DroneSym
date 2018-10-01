const GoogleStrategy = require('passport-google-oauth20').Strategy
const creds = require('../../config/credentials')
const User = require('../../Models/user')

module.exports = new GoogleStrategy({
  clientID: creds.google.clientID,
  clientSecret: creds.google.clientSecret,
  callbackURL: creds.google.callbackURL,
  passReqToCallback: true,
  scope: creds.google.scope
}, async (req, accessToken, refreshToken, profile, done) => {
    
    let data = profile._json    

    if (req.user) {
      //Already logged in user trying to connect, check whether already connected
      const googleaccount = await User.findOne({'google.id': data.id})
      
      if (googleaccount) {
        throw new Error('Your google account is already connected')
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
      
      const user = User.findOne({'google.id': data.id})
      //user logged in, if exists

      if (!user) {
        const users = await User.find({'google.email': data.email})
        
        if (users && users.length > 0) {
          return done(null, false, {message:'Account having this email already exists, please log into your account and connect to google there instead'})
        }
        
        let newGGL = new User({
          google: {
              id: data.id,
              username: data.emails[0].value.split('@')[0],
              email: data.emails[0].value,
              token: accessToken
          }
        })
        newGGL.save()
        //new signup
        const authed = await User.findOne({'google.id': data.id})
        
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