var User = require('../models/users');
var jwt = require('jsonwebtoken');
var config = require('../config/config');
var multer  = require('multer');
var storage = multer.diskStorage({
  destination: function (request, file, callback) {
    callback(null, './uploads');
  },
  filename: function (request, file, callback) {
    callback(null, file.originalname);
  }
});
var upload = multer({storage: storage}).single('photo');

exports.userRegister=function (req,res) {
  if(!req.body.email || !req.body.password) {
    res.status(400).json({ success: false, message: 'Please enter email and password.' });
  } else {
    var newUser = new User({
      email: req.body.email,
      password: req.body.password,
      firstname:req.body.firstname,
      lastname:req.body.lastname,
      address:req.body.address
    });
    newUser.password=newUser.generateHash(req.body.password);
    // save the user
    newUser.save(function(err) {
      if (err) {
        return res.status(400).json({ success: false, message: 'That email address already exists.'});
      }
      res.status(201).json({ success: true, message: 'Successfully created new user.' });
    });
  }
};
exports.userAuth=function(req, res) {
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
              expiresIn: 2592000 // in seconds
            });
            res.status(200).json({ success: true, token: 'JWT ' + token });
          }
        }
  });
};
exports.updateUser=function (req, res) {

  upload(req, res, function(err) {
    if(err) {
      return err;
    }
    User.findOneAndUpdate({_id:req.params.id},{$set:{photo:req.file.filename}},function (err,res) {
      if (err) {
        return res.status(404).json({ success: false, message: 'User not found.' });
      }
    });
    res.end('Your File Uploaded');
  });
};
