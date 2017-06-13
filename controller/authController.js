var User = require('../models/users');
var jwt = require('jsonwebtoken');
var config = require('../config/config');
var Skills = require('../models/Skills');
var Friends = require('../models/Friends');
var Stade = require('../models/Stade');

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
          poste:'Attaque',
          taille:0,
          poid:0,
          age :0,
          type:'Joueur'
      }
    });
    newUser.password=newUser.generateHash(req.body.password);
    if (req.body.role !== undefined) {
        newUser.role = req.body.role;
    }
    // save the user
    newUser.save(function(err) {
      if (err) {
        return res.json({ success: false, message: 'Adresse email déjà existe !'});
      }else{
        var skill= new Skills({ noteTo: newUser._id });
        var friend= new Friends({ user: newUser._id });
        skill.save((err)=>{err : console.log(err);});
        friend.save((err)=>{err : console.log(err);});
        if (newUser.role === 'Manager') {
            var stade = new Stade({ user: newUser._id });
            stade.save((err)=>{err : console.log(err);});
        }
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
      return res.json({ success: false, message: 'Utilisateur non trouvé !' });
    } else {
      // Check if password matches
        if (!user.validPassword(req.body.password)) {
            return res.json({ success: false, message: 'Mot de passe incorrect !' });
        } else {
          user.token = req.body.token;
          user.save((err)=>{err : console.log(err);});
          var token = jwt.sign(user, config.secret, {
            expiresIn: 2592000 // in seconds
          });
          if (user.role === 'Manager') {
              Stade.findOne({ user: user._id }, function(err, stade) {
                  if (err) {
                      return res.json({ success: false, message: 'Server Error !' });
                  } else {
                      return res.json({ success: true, token: 'JWT ' + token, user: user, stade: stade });
                  }
              });
          } else {
              return res.json({ success: true, token: 'JWT ' + token, user: user });
          }
        }
    }
  });
};
