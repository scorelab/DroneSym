"use strict"

var express = require('express');
var logger = require('morgan');
var mongoose = require('mongoose');
var passport = require('passport');
var bodyParser = require('body-parser');
var cors = require('cors');
var app = express();
var http = require('http');

http = http.Server(app);
var sockConn = require('./websocket').init(http);

var droneRouter = require('./Routers/droneRouter');
var userRouter = require('./Routers/userRouter');
var mongoConfig = require('./config/example.mongoconfig');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

//passport configuration
var passportConfig = require('./config/passportconfig')(passport);
app.use(passport.initialize());

//mongodb connection
mongoose.connect(mongoConfig.dbUri);

mongoose.connection.on('error', function(err){
  console.log(err);
})

mongoose.connection.on('open', function(){
  console.log('Userbase connected...');
})


app.use('/dronesym/api/node', droneRouter);
app.use('/dronesym/api/node/user', userRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.json({
    message: err.message,
    error: err
  });
});


http.listen(3000, function(){
	console.log("Listening on 3000..");
});

module.exports = app;