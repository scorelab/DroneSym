var mongoose = require('mongoose');
var passport = require('passport');

var mongoConn = mongoose.connect('mongodb://localhost:27017');

var user = require('./Models/user');