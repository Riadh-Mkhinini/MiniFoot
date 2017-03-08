/*jshint esversion: 6 */
var express=require('express');
var routes=(User,jwt,config)=>{
  var authRouter=express.Router();
  // Register new users
  authRouter.post('/register', function(req, res) {
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
  authRouter.post('/authenticate', function(req, res) {
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

return authRouter;
};
module.exports=routes;
