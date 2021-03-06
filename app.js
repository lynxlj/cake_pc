var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');


var indexRouter = require('./routes/index');
var idRouter = require('./routes/id');
var cakesRouter = require('./routes/cakes');
var storesRouter = require('./routes/stores');
var typesRouter = require('./routes/types');

var app = express();
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,username');
  next();
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//使用中间键
app.use(session({
  resave:false,//添加这行
  saveUninitialized: true,//添加这行
  secret:"zenghuishigoushi",
  cookie:{
    maxAge:60*60*1000
  }
}));

app.use('/', indexRouter);
app.use('/api', idRouter);
app.use('/api/cake',cakesRouter);
app.use('/api/store',storesRouter);
app.use('/api/type',typesRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
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