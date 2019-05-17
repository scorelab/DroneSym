const express = require('express');
const router = new express.Router();
const userCtrl = require('../Controllers/userCtrl');
const passport = require('passport');

const authorize = userCtrl.authorizeUser;
const authenticate = passport.authenticate('jwt', {session: false});

router.post('/login', function(req, res) {
  userCtrl.loginUser(req.body.uname, req.body.password, function(status) {
    res.json(status);
  });
});

router.post('/create', authenticate, authorize(['admin']), function(req, res) {
  userCtrl.createUser(req.body.uname, req.body.email,
      req.body.password, req.body.role,
      function(status) {
        res.json(status);
      });
});
router.post('/createuser', function(req, res) {
  userCtrl.createUserFromSignup(req.body.uname, req.body.password,
      req.body.role, req.body.email, function(status) {
        res.json(status);
      });
});

router.get('/role', authenticate, function(req, res) {
  res.json({status: 'OK', role: req.user.role});
});

router.get('/authenticate', authenticate, function(req, res) {
  res.json('Authorized');
});

router.post('/:groupId/add', authenticate, authorize(['admin']),
    function(req, res) {
      userCtrl.updateUserGroups(req.body.userId, req.params.groupId,
          insert=true, function(status) {
            res.json(status);
          });
    });

router.post('/:groupId/updategroup', authenticate, authorize(['admin']),
    function(req, res) {
      userCtrl.updateUserInGroup(req.body.userId, req.params.groupId,
          insert=true,
          function(status) {
            res.json(status);
          });
    });

router.post('/:groupId/remove', authenticate, authorize(['admin']),
    function(req, res) {
      userCtrl.updateUserGroups(req.body.userId, req.params.groupId,
          insert=false, function(status) {
            res.json(status);
          });
    });

router.get('/list', authenticate, authorize(['admin']), function(req, res) {
  userCtrl.getUserList(req.user.id, function(status) {
    res.json(status);
  });
});

module.exports = router;
