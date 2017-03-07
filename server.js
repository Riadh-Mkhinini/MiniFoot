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
//Log requests to console
app.use(morgan('dev'));
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());
//connect to db
mongoose.connect(config.urlDb);
//Home route
// Initialize passport for use
app.use(passport.initialize());
// Bring in defined Passport Strategy
require('./config/passport')(passport);
var apiRoutes = express.Router();

// Register new users
apiRoutes.post('/register', function(req, res) {
  if(!req.body.email || !req.body.password) {
    res.status(400).json({ success: false, message: 'Please enter email and password.' });
  } else {
    var newUser = new User({
      email: req.body.email,
      password: req.body.password

    });
    newUser.password=newUser.generateHash(req.body.password);
    // Attempt to save the user
    newUser.save(function(err) {
      if (err) {
        return res.status(400).json({ success: false, message: 'That email address already exists.'});
      }
      res.status(201).json({ success: true, message: 'Successfully created new user.' });
    });
  }
});

// Authenticate the user and get a JSON Web Token to include in the header of future requests.
apiRoutes.post('/authenticate', function(req, res) {
  User.findOne({
    email: req.body.email
  }, function(err, user) {
    if (err) throw err;
    if (!user) {
      res.status(401).json({ success: false, message: 'Authentication failed. User not found.' });
    } else {
      // Check if password matches
        if (!user.validPassword(req.body.password)) {
            res.status(401).json({ success: false, message: 'Authentication failed. Password did not match !' });
          }
          else{
            var token = jwt.sign(user, config.secret, {
              expiresIn: 10080 // in seconds
            });
            res.status(200).json({ success: true, token: 'JWT ' + token });
          }
        }
  });
});

apiRoutes.get('/dashbord',passport.authenticate('jwt',{session:false}),function(req,res){
  res.send('It worked user id is: ' + req.user._id );
});
app.use('/api',apiRoutes);

app.get('/api',passport.authenticate('jwt',{session:false}),function(req,res){
res.send("hello");
});


app.listen(PORT);
console.log("Listen on port "+ PORT);
