var User = require('../models/users');
var jwt = require('jsonwebtoken');
var config = require('../config/config');
var multer  = require('multer');
var Skills = require('../models/Skills');

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
    res.json({ success: false, message: 'Please enter email and password.' });
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
<<<<<<< HEAD
exports.updateUser=function (req, res) {
=======
exports.updatePhoto=function (req, res) {

>>>>>>> f8e60990d45acd9fc264a89f81fa304984a460b6
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

exports.getAllUsers = (req,res) => {
  let pageNumber=req.query.page;
  let nPerPage=2;
  User.find().skip(pageNumber > 0 ? ((pageNumber-1)*nPerPage) : 0).limit(nPerPage)
  .exec((err,data)=>{
    if (err) {
      res.status(500).json({ success: false, message: 'Internal Server Error.' });
    }else {
      res.status(200).json(data);
    }
  });
};

exports.getUserById = (req,res) => {
  idUser=req.params.idUser;
  User.findById(idUser,(err,data)=>{
    if (err) {
      res.status(500).json({ success: false, message: 'Internal Server Error.' });
    }else if (data) {
      res.status(200).json(data);
    }else{
        res.status(404).json({ success: false, message: 'User not found.' });
    }
      });
};

exports.updateUser = (req,res) => {
  idUser=req.params.idUser;
  User.findById(idUser,(err,data)=>{
    let user=req.body;
    if(user._id){
      delete user._id;

      for(let x in user){
        data[x] = user[x];
      }
      data.save((err)=>{
        if(err)
          res.status(400).json({ success: false, message: 'Bad Request.' });
        else{
          res.status(200).json(data);
          }
      });

    }else{
        res.status(404).json({ success: false, message: 'User not found.' });
    }
      });
};

exports.deleteUser = (req,res) => {
  idUser=req.params.idUser;
  User.findById(idUser,(err,data)=>{
    if (err) {
      res.status(500).json({ success: false, message: 'Internal Server Error.' });
    }else if (data) {
      data.remove();
      res.status(204).json({ success: true, message: 'No Content' });
    }else{
        res.status(404).json({ success: false, message: 'User not found.' });
    }
      });

};
