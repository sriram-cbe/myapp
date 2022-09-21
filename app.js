// All require goes here
createError = require('http-errors');
express = require('express');
path = require('path');
cookieParser = require('cookie-parser');
logger = require('morgan');
bodyParser = require('body-parser');
config = require('config');
mongoose = require('mongoose');
mongoose.set('useFindAndModify', false);
moment = require("moment");
fs = require('fs');
request = require('request');
admin = require('firebase-admin');
swaggerJSDoc = require('swagger-jsdoc');
utils = require('./common/utils');
var session = require('express-session');
var app = express();
// notification = require("./common/notification");

var cors = require('cors')
app.use(cors())

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
  secret: 'prosharkexpresssessionsecret0@1',
  resave: true,
  saveUninitialized: true
}));

app.use(express.static(path.join(__dirname, 'public')));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ limit: '5mb' }));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

var connStr = utils.getConnectionString();
mongoose.set('useCreateIndex', true);
mongoose.connect(connStr, { useNewUrlParser: true, useUnifiedTopology: true });
var db = mongoose.connection;
db.on('error', console.error.bind(console, "Connecting to DB " + connStr + " failed"));
db.once('open', function () {
  console.log("** DATABASE CONNECTED TO - " + connStr + " **");
});

// Models
userModel = require('./model/userModel');

// Routes

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

app.use('/', indexRouter);
app.use('/users', usersRouter);

// Services

// CORS
app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,client_id,client_secret,x-access-token, Authorization, time-zone');
  next();
});

// Swagger definition
var swaggerDefinition = {
  info: {
    title: 'My App - API Swagger Definition',
    version: '1.0.0',
    description: 'Demonstrating how to describe the My App API with Swagger',
  },
  host: config.project.url,
  basePath: '/',
};


// Options for the swagger docs
var options = {
  swaggerDefinition: swaggerDefinition,
  apis: ['./routes/*.js'],
};

// initialize swagger-jsdoc
var swaggerSpec = swaggerJSDoc(options);

// serve swagger
app.get('/swagger.json', function (req, res) {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

app.use('/asset', express.static(path.join(__dirname, 'asset')));
app.use(express.static(path.join(__dirname, 'public')));

module.exports = app;
