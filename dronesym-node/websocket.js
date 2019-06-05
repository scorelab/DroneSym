let io = require('socket.io');
let socketIoJwt = require('socketio-jwt');
let config = require('./config/jwtconfig');

exports.init = function(http) {
  let ioConn = io(http).of('/feed');
  ioConn.use(socketIoJwt.authorize({
    secret: config.secret,
    handshake: true,
  }));
  exports.connection = ioConn;
};
