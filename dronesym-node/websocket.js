var io = require('socket.io');

exports.init = function(http){
	exports.connection = io(http).of('/feed');
}
