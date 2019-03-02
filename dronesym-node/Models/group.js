var mongoose = require('mongoose');

var groupSchema = mongoose.Schema({
	name : {
		type: String,
		required: true
	},
	userId:{
		type: String,
		required: true
	},
	drones: {
		type: [String],
		default: []
	},
	users: {
		type : [{
			userId : String,
			userName : String
		}],
		default : []
	}
})

module.exports = mongoose.model('Groups', groupSchema);