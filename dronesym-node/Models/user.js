var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

var userSchema = mongoose.Schema({
	github: {
		id: { type: Number },
		username: { type: String, default: '' },
		email: { type: String, unique: true },
		token: { type: String }
	},
	google: {
		id: { type: Number },
		username: { type: String, default: '' },
		email: { type: String, unique: true },
		token: { type: String }
	},
	facebook: {
		id: { type: Number },
		username: { type: Number, default: '' },
		email: { type: String, unique: true },
		authToken: { type: Number },
		refreshToken: { type: Number }
	},
	uname: {
		type: String,
		required: true
	},
	password: {
		type: String,
		required: true
	},
	role: {
		type: String,
		enum: ['user', 'admin'],
		lowercase: true,
		required: true,
		default: 'user'
	},
	groups: {
		type : [{
			groupId : String,
			groupName : String
		}],
		default : []
	}
}, { timestamps: true });

userSchema.pre('save', function(next){
	var user = this;
	var SALT_FACTOR = 5;

	bcrypt.genSalt(SALT_FACTOR, function(err, salt){
		if(err){
			return next(err);
		}

		bcrypt.hash(user.password, salt, null, function(err, hash){
			if(err){
				return next(err);
			}

			user.password = hash;
			next();
		})
	})
});

userSchema.methods.comparePassword = function(password, callBack){
	bcrypt.compare(password, this.password, function(err, isMatch){
		if(err){
			callBack(err, null);
			return;
		}
		callBack(null, isMatch);
	})
}

module.exports = mongoose.model('User', userSchema);