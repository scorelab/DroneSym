const router = require('express').Router()
const passport = require('../auth/passporthandler')
const creds = require('../config/credentials')

router.get('/facebook', passport.authenticate('facebook', {
    session: false,
    scope: creds.facebook.profileFields
}), function(req,res){
      res.send(200)
})
router.get('/google', passport.authenticate('google', { session: false }))
router.get('/github', passport.authenticate('github', { session: false }))


router.get('/facebook/callback', passport.authenticate('facebook', {
    scope: creds.facebook.profileFields,
    failureRedirect: '/dronesym/api/node/user/login'
}), function (req,res){
      res.redirect('/dronesym/api/node/user/role')
})

router.get('/google/callback', passport.authenticate('google', {
    failureRedirect: '/dronesym/api/node/user/login'
}), function (req,res){
      res.redirect('/dronesym/api/node/user/role')
})

router.get('/github/callback', passport.authenticate('github', {
    failureRedirect: '/dronesym/api/node/user/login'
}), function (req,res){
      res.redirect('/dronesym/api/node/user/role')
})

module.exports = router

