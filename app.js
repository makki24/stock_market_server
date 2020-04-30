var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');
var FileStore = require('session-file-store')(session);
var connection =require('./connection');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var shareRouter = require('./routes/shares');
var tradeRouter= require('./routes/trades');
var corpRouter =require('./routes/corporation');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  name: 'session-id',
  secret: '12345-67890-09876-54321',
  saveUninitialized: false,
  resave: false,
  store: new FileStore()
}));

connection.connection;
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/shares',shareRouter);
app.use('/users/trades',tradeRouter);
app.use('/corporation',corpRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
 /* res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error'); */

  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  return res.json({
                        "success": false,
                        "status": 'login unsuccessfull',
                         err: err.message
                    });
});
module.exports = app;


