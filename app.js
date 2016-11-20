var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var client = require('./routes/client');
var server = require('./routes/server');

var app = express();

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', client);
app.use('/server', server);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  console.log("The request is here: catch 404 and about to forward");
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  console.log("The request is here: error handler: " + err);
  res.status(err.status || 500);
  if (err.status === 404){
    res.status(404).sendFile(path.join(__dirname, 'public', '404.html'));
    // res.render('404.html');
  } else {
    res.status(500).send('internal server error');
    // res.render('500.html');
  }
});

module.exports = app;
