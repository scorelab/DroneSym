const io = require('socket.io');
const socketIoJwt = require('socketio-jwt');
const config = require('./config/jwtconfig');

exports.init = function(http) {
  const ioConn = io(http).of('/feed');
  ioConn.use(socketIoJwt.authorize({
    secret: config.secret,
    handshake: true,
  }));
  exports.connection = ioConn;
};
