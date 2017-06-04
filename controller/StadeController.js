var User = require('../models/users');
var Stade = require('../models/Stade');
var Match = require('../models/Match');
var mongoose=require('mongoose');
var multer  = require('multer');
var path = require('path');
var fs = require('fs');

var storage = multer.diskStorage({
  destination: function (request, file, callback) {
    callback(null, './stadeUploads');
  },
  filename: function (request, file, callback) {
    const x = file.originalname.split('.');
    const imageName = `image${Date.now()}.${x[x.length - 1]}`;
    callback(null, imageName);
  }
});

var uploadMultiple = multer({storage: storage}).array('photo', 20);

exports.getPhotoStade=function (req, res) {
  fs.createReadStream(path.join('./stadeUploads', req.params.id)).pipe(res);
};

exports.getAllStades = (req,res) => {
  Stade.find({ name: new RegExp(req.query.name, 'i')}).populate({ path: 'user', select: ['firstname', 'lastname'] })
  .limit(5).skip(req.query.page * 5)
  .exec((err,data)=>{
    if (err) {
      return res.json({ success: false, message: 'Internal Server Error.' });
    }else {
      return res.status(200).json(data);
    }
  });
};
exports.getImagesStade=function (req, res) {
  Stade.findOne({ _id:req.params.idStade}).exec(function(err,data){
    if (err) {
      return res.json({ success: false, message: 'Stade not found.' });
    } else {
      return res.json(data.photos);
    }
  });
};
exports.getAbonneesStade=function (req, res) {
  Stade.findOne({ _id: req.params.idStade, 'abonnees.user': req.params.idUser }).exec(function(err,data){
    if (err) {
      return res.json({ success: false, message: 'Stade not found.' });
    } else {
        if (data === null) {
            return res.json({ success: false });
        } else {
            return res.json({ success: true });
        }
    }
  });
};
exports.addAbonneeStade=function (req, res) {
    Stade.findOneAndUpdate({ _id: req.params.idStade },
      { $push:{
        abonnees:{ user: req.params.idUser },
      }
    },function(err,data){
      if (err) {
        console.log(err);
      }
       return res.send({ success:true, message:'Successfully added abonnee.'});
    });
};
exports.deleteAbonneeStade=function (req, res) {
    Stade.findOneAndUpdate({ _id: req.params.idStade },
      { $pull:{
        abonnees:{ user: req.params.idUser },
      }
    },function(err,data){
      if (err) {
        console.log(err);
      }
       return res.send({ success:true, message:'Successfully deleted abonnee.'});
    });
};
exports.addStadePhotos=function (req, res) {
  var idStade=req.params.id;
  uploadMultiple(req, res, function(err) {
    if(err) {
      return err;
    }
    req.files.forEach((item) => {
        Stade.findOneAndUpdate({ _id: idStade},
            { $push:{photos: item.filename}}, function(err,data){
                if (err) {
                    return res.json({ success: false, message: 'Stade not found.' });
                } else {
                    return res.json({ success: true, name: item.filename});
                }
            });
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

exports.addNoteToStade = (req, res) => {
    Stade.findOneAndUpdate({ _id: req.params.idStade },
      { $push:{
        notes:{ user: req.query.idUser, value: req.query.note},
      }
    },function(err,data){
      if (err) {
        console.log(err);
      }
       return res.send({ success:true, message:'Successfully added notes.'});
    });
};

exports.updateStade = (req,res) => {
    idStade=req.params.idStade;
    Stade.findOne({_id: idStade}, (err,data) => {
      let stade=req.body;
      if(stade._id) {
        delete stade._id;
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
    Stade.findById(idStade).select('abonnees').populate
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
exports.getMatchStadeByDay = (req,res) => {
    var date = req.query.date;
    var dateParts = date.split("/");
    var start = new Date(dateParts[2], dateParts[1] - 1, dateParts[0]);
    var end = new Date(dateParts[2], dateParts[1] - 1, dateParts[0]);
    start.setHours(0,0,0,0);
    end.setHours(23,59,59,999);
    Match.find({ stade: req.params.idStade, 'event.start': { "$gte": start, "$lt": end } })
        .select(['event', 'teamOne', 'teamTow', 'scoreOne', 'scoreTow'])
        .populate({ path: 'teamOne', select: ['_id', 'name', 'logo'] })
        .populate({ path: 'teamTow', select: ['_id', 'name', 'logo'] })
        .sort({ 'event.start': 1 })
        .exec(function(err, data) {
          if (err) {
            res.status(200).send(err);
          } else {
            res.status(200).json(data);
          }
      });
};
