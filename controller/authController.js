var User = require('../models/users');
var jwt = require('jsonwebtoken');
var config = require('../config/config');
var Skills = require('../models/Skills');


exports.userRegister=function (req,res) {
  if(!req.body.email || !req.body.password) {
    res.json({ success: false, message: 'Please enter email and password.' });
  } else {
    var newUser = new User({
      email: req.body.email,
      password: req.body.password,
      firstname:req.body.firstname,
      lastname:req.body.lastname,
      adresse:req.body.adresse,
      photo:'userdefault.png',
      city:'Tunisia',
      phone:55555555,
      joueur:{
          poste:'Ajouter votre position sur le terrain',
          taille:0,
          poid:0,
          age :0,
          type:'Joueur'
      }
    });
    newUser.password=newUser.generateHash(req.body.password);
    // save the user
    newUser.save(function(err) {
      if (err) {
        return res.json({ success: false, message: 'That email address already exists.'});
      }else{
        var skill= new Skills({
          noteTo: newUser._id
        });
        skill.save((err)=>{err : console.log(err);});
        return res.json({ success: true, message: 'Successfully created new user.' });
      }
    });
  }
};

exports.userAuth=function(req, res) {
  User.findOne({
    email: req.body.email
  }, function(err, user) {
    if (err) throw err;
    if (!user) {
      res.json({ success: false, message: 'Authentication failed. User not found.' });
    } else {
      // Check if password matches
        if (!user.validPassword(req.body.password)) {
            res.json({ success: false, message: 'Authentication failed. Password did not match !' });
          }
          else{
            var token = jwt.sign(user, config.secret, {
              expiresIn: 2592000 // in seconds
            });

            res.status(200).json({ success: true, token: 'JWT ' + token, user: user });
          }
        }
  });
};
