var User = require('../models/users');
var Stade = require('../models/Stade');
var PhotosStade = require('../models/PhotosStade');
var mongoose=require('mongoose');
var multer  = require('multer');
var path = require('path');
var fs = require('fs');

var storage = multer.diskStorage({
  destination: function (request, file, callback) {
    callback(null, './stadeUploads');
  },
  filename: function (request, file, callback) {
    callback(null, file.originalname);
  }
});

var uploadMultiple = multer({storage: storage}).array('photo', 20);

exports.getPhotoStade=function (req, res) {
  fs.createReadStream(path.join('./stadeUploads', req.params.id)).pipe(res);
};

exports.getImagesStade=function (req, res) {
  PhotosStade.findOne({ stade:req.params.idStade}).exec(function(err,data){
    if (err) {
      return res.json({ success: false, message: 'Stade not found.' });
    } else {
      return res.json(data);
    }
  });
};

exports.addPhotosStade=function (req, res) {
  var idStade=req.params.idStade;
  uploadMultiple(req, res, function(err) {
    if(err) {
      return err;
    }
    PhotosStade.find({ stade: idStade}).exec(function(err,data){
      if (err) {
        return res.json({ success: false, message: 'Stade not found.' });
      } else {
      }
    });
  });
};

exports.getStadeById = (req,res) => {
  idStade=req.params.idStade;
  Stade.findById(idStade).populate
    ({
        path:'user',
        select: ['_id', 'firstname', 'lastname', 'photo']
    })
    .exec(function(err, data) {
        if (err) {
          res.status(500).send(err);
        }else {
          res.status(200).json(data);
        }
    });
};

exports.updateStade = (req,res) => {
    idStade=req.params.idStade;
    Stade.findById(idStade, (err,data) => {
      let stade=req.body;
      if(stade.id) {
        delete stade.id;
        for(let x in stade) {
          data[x] = stade[x];
        }
        data.save((err)=>{
          if(err) {
            return res.json({ success: false, message: 'Bad Request.' });
          } else {
            return res.status(202).json(data);
          }
        });
      } else {
          return res.send({ success: false, message: 'stade not found.' });
      }
    });
};

exports.getListAbonneesStade = (req,res) => {
    idStade=req.params.idStade;
    console.log(idStade);
    Stade.findById(idStade).populate
      ({
          path:'abonnees.user',
          select: ['_id', 'firstname', 'lastname', 'joueur', 'adresse']
      })
      .exec(function(err, data) {
          if (err) {
            res.status(500).send(err);
          }else {
            res.status(200).json(data);
          }
      });
};
