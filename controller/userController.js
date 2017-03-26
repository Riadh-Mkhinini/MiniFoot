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
  //let pageNumber=req.query.page;
  //.skip(pageNumber > 0 ? ((pageNumber-1)*nPerPage) : 0).limit(nPerPage)
  //let nPerPage=10;
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

exports.updatePhoto=function (req, res) {
  upload(req, res, function(err) {
      console.log('service photo',req.file);
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

exports.getPhoto=function (req, res) {
  //res.setHeader('Content-Type', storedMimeType)
  fs.createReadStream(path.join('./uploads', req.params.id)).pipe(res);
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
