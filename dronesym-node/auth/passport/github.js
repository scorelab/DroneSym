const GithubStrategy = require('passport-github2').Strategy
const creds = require('../../config/credentials')
const User = require('../../Models/user')

module.exports = new GithubStrategy({
  clientID: creds.github.clientID,
  clientSecret: creds.github.clientSecret,
  callbackURL: creds.github.callbackURL,
  passReqToCallback: true
}, async (req, token, profile, done) => {
    
    let data = profile._json;
    let oldUser = req.user
    
      if (oldUser){
        //Already logged in user trying to login, check whether already in session
        const ghaccount = await User.findOne({'github.id': data.id})
        
        if (ghaccount) {
          console.log('Already logged in, fetching account')
        }
        else {
          const update = await User.findOne({'github.id': data.id})
          
          if (update) {
            update.github.id = data.id;
            update.github.username = data.name;
            update.github.email = data.email || 'N/A';
            update.github.token = token;
          }
          await update.save()
          
          const user = await User.findOne({'github.id': data.id})
          
          if (user) {
            return done(null, user)
          }
          else {
            console.log('Couldn\'t fetch existing user')
            return done(null, false)
          }
        }
        
      }
      else {
        //New login
        const user = await User.findOne({'github.id': data.id})
        
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