'use strict';

let express = require('express');
let logger = require('morgan');
let mongoose = require('mongoose');
let passport = require('passport');
let bodyParser = require('body-parser');
let cors = require('cors');
let app = express();
let http = require('http');
// You can change the port to any other, if 3000 is busy or being used by any other service.
let port = 3000;

http = http.Server(app);
let sockConn = require('./websocket').init(http);

let droneRouter = require('./Routers/droneRouter');
let userRouter = require('./Routers/userRouter');
let mongoConfig = require('./config/example.mongoconfig');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cors());

// passport configuration
let passportConfig = require('./config/passportconfig')(passport);
app.use(passport.initialize());

// mongodb connection
mongoose.connect(mongoConfig.dbUri, {useNewUrlParser: true});

mongoose.connection.on('error', function(err) {
  console.log(err);
});

mongoose.connection.on('open', function() {
  console.log('Userbase connected...');
});


app.use('/dronesym/api/node', droneRouter);
app.use('/dronesym/api/node/user', userRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  let err = new Error('Not Found');
  err.status = 404;
  next(err);
});

app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.json({
    message: err.message,
    error: err,
  });
});


http.listen(port, function() {
  // eslint-disable-next-line no-console
  console.log('Listening on ' + port + '..');
});

module.exports = app;
