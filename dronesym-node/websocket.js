var io = require('socket.io');
var socketIoJwt = require('socketio-jwt');
var config = require('./config/jwtconfig');

exports.init = function(http){
	var ioConn = io(http).of('/feed');
	ioConn.use(socketIoJwt.authorize({
		secret : config.secret,
		handshake : true
	}));
	exports.connection = ioConn;
}
