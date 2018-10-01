const GithubStrategy = require('passport-github2').Strategy
const creds = require('../../config/credentials')
const User = require('../../Models/user')

module.exports = new GithubStrategy({
  clientID: creds.github.clientID,
  clientSecret: creds.github.clientSecret,
  callbackURL: creds.github.callbackURL,
  passReqToCallback: true
}, async (req, token, tokenSecret, profile, done) => {
    
    let data = profile._json;
    
      if (req.user){
        //Already logged in user trying to connect, check whether already connected
        const ghaccount = await User.findOne({'github.id': data.id})
        
        if (ghaccount) {
          throw new Error('Your github account is already connected')
        }
        else {
          const update = await User.findOne({id: req.user.id})
          
          if (update) {
            update.github.id = data.id;
            update.github.username = data.name;
            update.github.email = data.email || 'N/A';
            update.github.token = token;
          }
          await update.save()
          
          const user = await User.findOne({'github.id': data.id})
          
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
        
        const user = User.findOne({'github.id': data.id})
        //user logged in, if exists

        // if (err) {
        //   return done(err)
        // }
        if (!user) {
          const users = await User.find({'github.email': data.email})
          
          if (users && users.length > 0) {
            return done(null, false, {message:'Account having this email already exists, please log into your account and connect to github there instead'})
          }
          
          let newGH = new User({
            github: {
                id: data.id,
                username: data.name,
                email: data.email,
                token: token
            }
          })
          newGH.save()
          //new signup
          const authed = await User.findOne({'github.id': data.id})
          
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