var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var exphbs      = require('express-handlebars');
var routes = require('./routes/index');
var session     = require('express-session');
var authority = require('./db/authority');
var hbsHelper = require('./lib/hbsHelper');

var mongoose = require('mongoose');
var config = require('./config');
var dbHelper = require('./db/dbHelper');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

//配置hbs基础模板和分块模板
var hbs = exphbs.create({
  partialsDir: 'views/partials',
  layoutsDir: "views/layouts/",
  defaultLayout: 'main',
  extname: '.hbs',
  helpers: hbsHelper
});
app.engine('hbs', hbs.engine);

//加入session支持
app.use(session({
  name:'blogOfHiQiyang',
  maxAge: 30 * 1000,
  secret: 'huqiyang-web-node-secret-key',
  resave: false,
  saveUninitialized: false
}));
// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, '/')));

app.use('/', require('./routes/login'));
app.use('/p', authority.isAuthenticated, require('./routes/index'));
app.use('/admin', authority.isAuthenticated, require('./routes/admin'));


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
