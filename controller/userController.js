var User = require('../models/users');
var multer  = require('multer');
var path = require('path');
var fs = require('fs');

var storage = multer.diskStorage({
  destination: function (request, file, callback) {
    callback(null, './uploads');
  },
  filename: function (request, file, callback) {
    callback(null, file.originalname);
  }
});

var upload = multer({storage: storage}).single('photo');

exports.getAllUsers = (req,res) => {
  User.find({$text: {$search: `/${req.query.name}/`}}).exec((err,data)=>{
    if (err) {
      res.json({ success: false, message: 'Internal Server Error.' });
    }else {
      res.status(200).json(data);
    }
  });
};

exports.getUserById = (req,res) => {
  idUser=req.params.idUser;
  User.findById(idUser).populate
    ({
        path:'equipe',
        select: ['_id', 'name', 'adresse', 'description', 'createdBy', 'logo']
    })
    .exec(function(err, data) {
    if (err) {
      res.status(500).json({ success: false, message: 'Internal Server Error.' });
    }else if (data) {
      res.status(200).json(data);
    }else{
        res.status(404).json({ success: false, message: 'User not found.' });
    }
      });
};

exports.updatePhoto=function (req, res) {
  upload(req, res, function(err) {
    if(err) {
      return err;
    }
    console.log(req.file);
    User.findOneAndUpdate({_id:req.params.id},{$set:{photo:req.file.filename}},function (err,res) {
      if (err) {
        return res.status(404).json({ success: false, message: 'User not found.' });
      }
    });
    res.end('Your File Uploaded');
  });
};

exports.getPhoto=function (req, res) {
  fs.createReadStream(path.join('./uploads', req.params.id)).pipe(res);
};

exports.updateUser = (req,res) => {
  idUser=req.params.idUser;
  User.findById(idUser,(err,data)=>{
    let user=req.body;
    if(user.id){
      delete user.id;

      for(let x in user){
        data[x] = user[x];
      }
      data.save((err)=>{
        if(err){
          res.json({ success: false, message: 'Bad Request.' });
        }else{
          res.status(202).json(data);
        }
      });

    }else{
        res.send({ success: false, message: 'User not found.' });
    }
  });
};

exports.updatePassword = (req,res) => {
  idUser=req.params.idUser;
  User.findOneAndUpdate({_id:idUser},{$set:{password:req.body.password}},function (err,data) {
    if (err) {
      res.json({ success: false, message: 'Bad Request.' });
    } else{
          data.password = data.generateHash(req.body.password);
          data.save((err)=>{
            if(err){
              res.json({ success: false, message: 'Bad Request.' });
            }else{
              return res.json({ success: true, message: 'update password.' });
              }
          });
        }
});
};
