const router = require('express').Router()
const passport = require('../auth/passporthandler')
const creds = require('../config/credentials')

router.get('/facebook', passport.authorize('facebook', {
    scope: creds.facebook.profileFields
}))
router.get('/google', passport.authorize('google'))
router.get('/github', passport.authorize('github'))


router.get('/facebook/callback', passport.authorize('facebook', {
    scope: creds.facebook.profileFields,
    failureRedirect: '/dronesym/api/node/user/login',
    successReturnToOrRedirect: '/dronesym/api/node/user/role'
}))

router.get('/google/callback', passport.authorize('google', {
    failureRedirect: '/dronesym/api/node/user/login',
    successReturnToOrRedirect: '/dronesym/api/node/user/role'
}))

router.get('/github/callback', passport.authorize('github', {
    failureRedirect: '/dronesym/api/node/user/login',
    successReturnToOrRedirect: '/dronesym/api/node/user/role'
}))

module.exports = router

