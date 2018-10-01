const credentials = {
  facebook: {
    clientID: 'fb-app-id',
    clientSecret: 'fb-app-secret',
    callbackURL: 'your-facebook-app-callbackURL',
    profileFields: ['email']
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
    scope: ['profile']
  }
}

module.exports = credentials