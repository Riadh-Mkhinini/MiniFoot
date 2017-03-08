/*jshint esversion: 6 */
var express=require('express');
var mongoose = require('mongoose');
var morgan=require('morgan');
var bodyParser = require('body-parser');
var passport = require('passport');
var jwt = require('jsonwebtoken');

var config = require('./config/config');
var User = require('./models/users');
var app=express();
const PORT=process.env.PORT || 3000;
/*app.use(function (req, res, next){
  if (req.headers['x-forwarded-proto'] === 'http') {
    next();
  } else {
    res.redirect('http://' + req.hostname + req.url);
  }
});*/
//Log requests to console
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
//connect to db
mongoose.connect(config.urlDb);
// Initialize passport for use
app.use(passport.initialize());
// Bring in defined Passport Strategy
require('./config/passport')(passport);
var apiRoutes = express.Router();
var authRouter=require('./routes/authRouter')(User,jwt,config);
app.use('/api',authRouter);

app.get('/api',passport.authenticate('jwt',{session:false}),function(req,res){
  console.log(req);
  res.send("hello");
});


app.listen(PORT);
console.log("Listen on port "+ PORT);
