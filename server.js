/*jshint esversion: 6 */
var express=require('express');
var mongoose = require('mongoose');
var morgan=require('morgan');
var bodyParser = require('body-parser');
var passport = require('passport');
var jwt = require('jsonwebtoken');

var config = require('./config/config');
var app=express();
const PORT=process.env.PORT || 3000;


var server = require('http').createServer(app);
var io = require('socket.io')(server);

require('./controller/chatController')(io);

// Log requests to console
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
// connect to db
mongoose.connect(config.urlDb, {
  server: {
    socketOptions: {
      socketTimeoutMS: 0,
      connectionTimeout: 0
    }
  }
});
mongoose.Promise = global.Promise;
// Initialize passport for use
app.use(passport.initialize());
// defined Passport Strategy
require('./config/passport')(passport);

var authRouter=require('./routes/authRouter')();
var friendsRouter=require('./routes/friendsRouter')();
var roomRouter=require('./routes/roomRouter')();
var equipeRouter=require('./routes/equipeRouter')();
var notificationRouter=require('./routes/notificationRouter')();
var advertRouter=require('./routes/advertRouter')();
var stadeRouter=require('./routes/stadeRouter')();
var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
    // intercept OPTIONS method
    if ('OPTIONS' == req.method) {
        res.sendStatus(200);
    } else {
        next();
    }
};

app.use(allowCrossDomain);
app.use('/api',authRouter);
app.use('/api/friends',friendsRouter);
app.use('/api/equipe',equipeRouter);
app.use('/api/rooms', roomRouter);
app.use('/api/notification', notificationRouter);
app.use('/api/adverts', advertRouter);
app.use('/api/stade', advertRouter);

app.get('/api',passport.authenticate('jwt',{session:false}),function(req,res){
  res.send("hello");
});

app.get('/',function(req,res){
  res.send("welcome to my api");
});
server.listen(PORT);
//app.listen(PORT);
console.log("Listen on port "+ PORT);
