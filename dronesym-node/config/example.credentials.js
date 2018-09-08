const credentials = {
  facebook: {
    clientID: 'fb-app-id',
    clientSecret: 'fb-app-secret',
    callbackURL: 'your-facebook-app-callbackURL',
    profileFields: ['id', 'name', 'picture', 'email']
  },
  github: {
    clientID: 'github-app-id',
    clientSecret: 'github-app-secret',
    callbackURL: 'your-github-app-callbackURL'
  },
  google: {
    clientID: 'google-app-id',
    clientSecret: 'google-app-secret',
    callbackURL: 'your-google-app-callbackURL',
    scope: ['id', 'name', 'email', 'profile']
  }
}

module.exports = credentials