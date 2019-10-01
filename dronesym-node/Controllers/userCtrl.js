/* eslint-disable no-var */
const User = require('../Models/user');
const Group = require('../Models/group');
const Drone = require('../Models/drone');
const jwt = require('jsonwebtoken');
const jwtConfig = require('../config/jwtconfig');
const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');
// ChangeStream Watch for User
// User.watch().
//     on('change', (data) => console.log(data));
/** Regular expression for email validation */
// eslint-disable-next-line max-len
regexp = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);

/**
 * Updates mongodb, in this case when user groups change
 * @param {string} droneId
 * id of drone
 * @param {object} userInfo
 * object containing userId, groupId and groupName
 * @param {boolean} insert
 * boolean informing whether users of given drone changed
 */

/**
 * Updates mongo db, in this case when user groups change
 * @param {string} droneId
 * id of drone
 * @param {object} userInfo
 * object containing userId, groupId and groupName
 * @param {boolean} insert
 * boolean informing whether users of given drone changed
 */

const updateMongoDB=function(droneId, userInfo, insert=true) {
  Drone.findOne({_id: droneId}, function(err, drone) {
    if (err) {
      // callBack({status: 'ERROR', msg: err});
      return;
    }

    if (insert) {
      Drone.findOneAndUpdate({_id: droneId},
          {$push: {users: userInfo}}, {new: true}, function(err, user) {
            if (err) {
              // callBack({status: 'ERROR', msg: err});
              return;
            }
            // console.log(user);
            // callBack({status: 'OK', user: user});
          });
    } else {
      Drone.updateOne({_id: droneId},
          {$pull: {users: userInfo}}, {new: true}, function(err, user) {
            console.log('Deleted' + user);
            if (err) {
            // callBack({status: 'ERROR', msg: err});
              return;
            }
            // console.log(user);
          // callBack({status: 'OK', user: user});
          });
      Group.updateOne({_id: userInfo.groupId},
          {$pull: {users: {userId: userInfo.userId}}}, {new: true}, function(err, user) {
            console.log('Deleted' + user);
            if (err) {
              // callBack({status: 'ERROR', msg: err});
              return;
            }
            // console.log(user);
            callBack({status: 'OK', user: user});
          });
      User.updateOne({_id: userInfo.userId},
          {$pull: {groups: {groupId: userInfo.groupId}}}, {new: true}, function(err, user) {
            console.log('Deleted' + user);
            if (err) {
              // callBack({status: 'ERROR', msg: err});
              return;
            }
            // console.log(user);
            // callBack({status: 'OK', user: user});
          });
    }
  });
};
/**
 * Creates a JWT token out of given user object
 * @param {object} user - object containing params of user
 */
const tokenizeUserInfo = function(user) {
  const userInfo = {};
  userInfo.id = user._id;
  userInfo.name = user.uname;

  const token = jwt.sign(userInfo, jwtConfig.secret, {
    expiresIn: jwtConfig.expiresIn,
    issuer: jwtConfig.issuer,
  });

  return token;
};

/**
 * Extracts important informations out of user object
 * @param {object} user - object containing params of user
 */
const filterUser = function(user) {
  return {
    id: user._id,
    uname: user.uname,
    groups: user.groups,
  };
};


/**
 * Creates user with given parameters, and saves it in DB
 * @param {string} uname
 * username of user we want to create
 * @param {string} password
 * password of user we want to create, is later encrypted
 * @param {string} role
 * role of user we want to create, default is 'user', other is 'admin'
 * @param {function} callBack
 * function to return result of creating an user to
 */
exports.createUser = function(uname, email, password, role, callBack) {
  if (!uname || !password) {
    callBack({status: 'ERROR', msg: 'Username and password must be specified'});
    return;
  }

  User.findOne({uname: uname}, function(err, user) {
    if (err) {
      callBack({status: 'ERROR', msg: err});
      return;
    }

    if (user) {
      callBack({status: 'ERROR', msg: 'Username already taken'});
      return;
    }

    var user = new User();

    user.uname = uname;
    user.email=email;
    user.password = password;
    user.role = role;

    user.save(function(err, status) {
      if (err) {
        callBack({status: 'ERROR', msg: err});
        return;
      }

      const token = tokenizeUserInfo(status);
      callBack({status: 'OK', token: 'JWT ' + token});
    });
  });
};
/**
 * Creates user from signup page with given parameters, and saves it in DB
 * @param {string} uname
 * username of user we want to create
 * @param {string} password
 * password of user we want to create, is later encrypted
 * @param {string} role
 * role of user we want to create, default is 'user'
 * @param {string} email
 * email of user we want to create
 * @param {function} callBack
 * function to return result of creating an user to
 */
exports.createUserFromSignup =
  function(uname, password, role, email, callBack) {
    if (!uname || !password) {
      callBack(
          {status: 'ERROR', msg: 'Username and password must be specified'});
      return;
    }

    User.findOne({uname: uname}, function(err, user) {
      if (err) {
        callBack({status: 'ERROR', msg: err});
        return;
      }

      if (user) {
        callBack({status: 'ERROR', msg: 'Username already taken'});
        return;
      }

      var user = new User();

      user.uname = uname;
      user.password = password;
      user.role = role;
      user.email=email;
      user.save(function(err, status) {
        if (err) {
          callBack({status: 'ERROR', msg: err});
          return;
        }

        const token = tokenizeUserInfo(status);
        callBack({status: 'OK', token: 'JWT ' + token});
      });
    });
  };
/**
 * Logs in given user
 * @param {string} uname - username of given user
 * @param {string} password - password of given user
 * @param {string} callBack - function to return result of user login to
 */
exports.loginUser = function(uname, password, callBack) {
  if (!uname || !password) {
    callBack({status: 'ERROR', msg: 'Username and password must be specified'});
    return;
  }

  if (regexp.test(uname)) {
    User.findOne({email: uname}, function(err, user) {
      if (err) {
        callBack({status: 'ERROR', msg: err});
        return;
      }

      if (!user) {
        callBack({status: 'ERROR', msg: 'Invalid Email-Id'});
        return;
      }

      user.comparePassword(password, function(err, isMatched) {
        if (err) {
          callBack({status: 'ERROR', msg: err});
          return;
        }

        if (isMatched) {
          const token = tokenizeUserInfo(user);
          callBack({status: 'OK', token: 'JWT ' + token, role: user.role});
        } else {
          callBack({status: 'ERROR', msg: 'Invalid password'});
        }
      });
    });
  } else {
    User.findOne({uname: uname}, function(err, user) {
      if (err) {
        callBack({status: 'ERROR', msg: err});
        return;
      }

      if (!user) {
        callBack({status: 'ERROR', msg: 'Invalid username'});
        return;
      }

      user.comparePassword(password, function(err, isMatched) {
        if (err) {
          callBack({status: 'ERROR', msg: err});
          return;
        }

        if (isMatched) {
          const token = tokenizeUserInfo(user);
          callBack({status: 'OK', token: 'JWT ' + token, role: user.role});
        } else {
          callBack({status: 'ERROR', msg: 'Invalid password'});
        }
      });
    });
  }
};
exports.sendEmail = function(code, callBack) {
  // Generate SMTP service account from ethereal.email
  nodemailer.createTestAccount((err, account) => {
    if (err) {
      console.error('Failed to create a testing account. ' + err.message);
      callBack({status: 'ERROR', msg: 'Failed to create a testing account.'});
      return process.exit(1);
    }

    console.log('Credentials obtained, sending message...');

    // Create a SMTP transporter object
    const transporter = nodemailer.createTransport({
      host: account.smtp.host,
      port: account.smtp.port,
      secure: account.smtp.secure,
      auth: {
        user: account.user,
        pass: account.pass,
      },
    });

    // Message object
    const message = {
      from: 'DroneSym Support <support@dronesym.com>',
      to: 'Recipient <recipient@example.com>',
      subject: 'Password Reset',
      text: 'Password reset code :'+ code,
      html: '<p>Password reset code : <b>'+ code + '</b></p>',
    };

    transporter.sendMail(message, (err, info) => {
      if (err) {
        console.log('Error occurred. ' + err.message);
        callBack({status: 'ERROR', msg: 'Error occurred.'});
        return process.exit(1);
      }

      console.log('Message sent: %s', info.messageId);
      // Preview only available when sending through an Ethereal account
      console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    });
    callBack({status: 'OK', res: 'success'});
  });
};
exports.check = function(uname, callBack) {
  if (!uname) {
    callBack({status: 'ERROR', msg: 'email must be specified'});
    return;
  }

  if (regexp.test(uname)) {
    User.findOne({email: uname}, function(err, user) {
      if (err) {
        callBack({status: 'ERROR', msg: err});
        return;
      }

      if (!user) {
        callBack({status: 'ERROR', msg: 'Invalid Email-Id'});
        return;
      } else {
        callBack({status: 'OK', res: user.email});
        return;
      }
    });
  } else {
    User.findOne({uname: uname}, function(err, user) {
      if (err) {
        callBack({status: 'ERROR', msg: err});
        return;
      }

      if (!user) {
        callBack({status: 'ERROR', msg: 'Invalid username'});
        return;
      } else {
        callBack({status: 'OK', res: user.email});
        return;
      }
    });
  }
};
/**
 * Function that authorizes user (IDK where it is used)
 * @param {array} roles - array of roles
 */
exports.authorizeUser = function(roles) {
  return function(req, res, next) {
    const user = req.user;

    if (roles.indexOf(user.role) > -1) {
      next();
    } else {
      res.status(401).json('Unauthorize');
      return;
    }
  };
};
/**
 * Function to update user array of groups
 * @param {string} userId
 * id of user
 * @param {string} groupId
 * id of group
 * @param {boolean} insert
 * boolean informing whether users of given drone changed
 * @param {function} callBack
 *  function to return result of updating user groups to
 */
exports.updateUserInGroup=function(userId, groupId, insert=true, callBack) {
  User.findOne({_id: userId}, function(err, user) {
    if (err) {
      callBack({status: 'ERROR', msg: err});
      return;
    }
    // console.log(user);

    const userInfo = {userId: userId, userName: user.uname};
    // console.log(groupId);

    Group.findOne({_id: groupId}, function(err, group) {
      if (err) {
        callBack({status: 'ERROR', msg: err});
        return;
      }

      if (!group) {
        callBack({status: 'ERROR', msg: 'Group not found'});
        return;
      }
      // console.log(group);
      if (insert) {
        Group.findOneAndUpdate({_id: groupId},
            {$push: {users: userInfo}}, {new: true}, function(err, user) {
              // console.log(user);
              if (err) {
                // console.log(1);
                callBack({status: 'ERROR', msg: err});
                return;
              }

              callBack({status: 'OK', user: filterUser(user)});
            });
      } else {
        User.findOneAndUpdate({_id: groupId},
            {$pull: {users: {$in: [{userId: userId}]}}},
            {new: true}, function(err, user) {
              if (err) {
                callBack({status: 'ERROR'});
                return;
              }

              callBack({status: 'OK', group: filterUser(user)});
            });
      }
    });
  });
};

exports.updatePass = function(user, pass, callBack) {
  const SALT_FACTOR = 5;
  bcrypt.genSalt(SALT_FACTOR, function(err, salt) {
    bcrypt.hash(pass, salt, null, function(err, hash) {
      // console.log(hash);
      User.update({uname: user}, {
        password: hash,
      }, function(err, user) {
        if (err) {
          callBack({status: 'ERROR'});
          return;
        }

        callBack({status: 'OK'});
      });
      // Store hash in your password DB.
    });
  });
  // callBack({status: 'OK'});
};

/**
 * Function to update groups array of user,
 * as well as users array of his/her drones
 * @param {string} userId
 * id of user
 * @param {string} groupId
 * id of group
 * @param {boolean} insert
 * boolean informing whether users of given drone changed
 * @param {function} callBack
 * function to return result of updating user groups to
 */
exports.updateUserGroups = function(userId, groupId, insert=true, callBack) {
  Group.findOne({_id: groupId}, function(err, group) {
    if (err) {
      callBack({status: 'ERROR', msg: err});
      return;
    }

    if (!group) {
      callBack({status: 'ERROR', msg: 'Group not found'});
      return;
    }

    const groupInfo = {userId: userId, groupId: groupId, groupName: group.name};

    User.findOne({_id: userId}, function(err, user) {
      if (err) {
        callBack({status: 'ERROR', msg: err});
        return;
      }

      const drones = group.drones;

      drones.forEach(function(droneId) {
        updateMongoDB(droneId, groupInfo, insert);
      });

      if (insert) {
        User.findOneAndUpdate({_id: userId},
            {$push: {groups: groupInfo}}, {new: true}, function(err, user) {
              if (err) {
                callBack({status: 'ERROR', msg: err});
                return;
              }

              callBack({status: 'OK', user: filterUser(user)});
            });
      } else {
        User.findOneAndUpdate({_id: userId},
            {$pull: {groups: {$in: [{groupId: groupId}]}}}, {new: true},
            function(err, user) {
              if (err) {
                callBack({status: 'ERROR'});
                return;
              }

              callBack({status: 'OK', user: filterUser(user)});
            });
      }
    });
  });
};

/**
 * Admin function to get list of all users
 * @param {string} userId
 * id of user
 * @param {function} callBack
 * function to return result of getting user list to
 */
exports.getUserList = function(userId, callBack) {
  if (!userId) {
    callBack({status: 'ERROR', msg: 'User ID can\'t be null'});
    return;
  }

  User.find({_id: {$ne: userId}}, function(err, users) {
    if (err) {
      callBack({status: 'ERROR', msg: err});
      return;
    }

    if (!users) {
      callBack({status: 'ERROR', msg: 'No user found'});
      return;
    }

    const filteredUsers = users.map(function(user) {
      return {
        id: user._id,
        uname: user.uname,
        groups: user.groups.map((drone) => {
          return {
            groupId: drone.groupId,
            groupName: drone.groupName,
          };
        }),
      };
    });

    callBack({status: 'OK', users: filteredUsers});
  });
};
