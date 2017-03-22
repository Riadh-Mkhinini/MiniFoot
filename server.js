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
// Log requests to console
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
// connect to db
mongoose.connect(config.urlDb);
// Initialize passport for use
app.use(passport.initialize());
// defined Passport Strategy
require('./config/passport')(passport);

var authRouter=require('./routes/authRouter')();
var skillsRouter=require('./routes/skillsRouter')();

app.use('/api',authRouter);
app.use('/api/skills',skillsRouter);

app.get('/api',passport.authenticate('jwt',{session:false}),function(req,res){
  res.send("hello");
});

app.get('/',function(req,res){
  res.send("welcome to my api");
});
app.listen(PORT);
console.log("Listen on port "+ PORT);
