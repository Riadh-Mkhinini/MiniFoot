var Equipe = require('../models/Equipe');
var User = require('../models/users');
var mongoose=require('mongoose');
var multer  = require('multer');
var path = require('path');
var fs = require('fs');

var storage = multer.diskStorage({
  destination: function (request, file, callback) {
    callback(null, './teamUploads');
  },
  filename: function (request, file, callback) {
    callback(null, file.originalname);
  }
});

var upload = multer({storage: storage}).single('photo');

exports.getPhoto=function (req, res) {
  fs.createReadStream(path.join('./teamUploads', req.params.id)).pipe(res);
};

exports.updatePhoto=function (req, res) {
  upload(req, res, function(err) {
    if(err) {
      return err;
    }
    Equipe.findOneAndUpdate({_id:req.params.id},{$set:{logo:req.file.filename}},function (err,response) {
      if (err) {
        return res.json({ success: false, message: 'Equipe not found.' });
      }else {
          response.logo = req.file.filename;
          return res.json({ success: true, message: response});
      }
    });
  });
};


exports.createEquipe = (req,res) => {
  let equipe=new Equipe(req.body);
  if (!req.body.name) {
      res.json({ success: false, message: 'Svp choisir un nom pour votre équipe.' });
  }else {
    var player = { idJoueur: req.body.createdBy, x: 0, y:0 };
    equipe.joueurs.push(player);
    equipe.save((err) => {
      if(err){
        res.json({ success: false, message: 'Bad Request.' });
      }else{
          User.findOne({ _id: req.body.createdBy}, function(err, data){
             if (err) {
                 return res.json({ success: false, message: 'Internal Server Error.' });
             } else {
                 data.joueur.type = 'Responsable';
                 data.save(function(error) {
                     if (error) {
                         return res.json({ success: false, message: 'Internal Server Error.' });
                     }else {
                         return res.json({ success: true, message: equipe });
                     }
                 });
             }
          });
      }
    });
  }
};

exports.getAllEquipe = (req,res) => {
  Equipe.find({$text: {$search: `/${req.query.name}/`}}).exec((err,data)=>{
    if (err) {
      res.json({ success: false, message: 'Internal Server Error.' });
    }else {
      res.status(200).json(data);
    }
  });
};

exports.getEquipeById = (req,res) => {
  idEquipe=req.params.idEquipe;
  Equipe.findById(idEquipe).populate
    ({
        path:'createdBy',
        select: ['_id', 'firstname', 'lastname', 'photo']
    }).populate
    ({
        path:'joueurs.idJoueur',
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

exports.updateTeam= (req,res) => {
    var idEquipe=req.params.idEquipe;
    Equipe.findById(idEquipe,(err, data) => {
     if (err) {
       res.send({ success: false, message: 'Team not found.' });
     } else {
         console.log(data.name);
        data.name = req.body.name;
        data.description = req.body.description;
        data.save(function(error){
          console.log(data.name);
          if(error)
            res.send({ success: false, message: 'Internal Server Error.' });
          else{
              res.json(data);
            }
        });
     }
    });
};

exports.updateJoueurs = (req,res) => {
    var idEquipe=req.params.idEquipe;
    Equipe.findOne({ _id: idEquipe }, (err, data) => {
     if (err) {
       res.send({ success: false, message: 'Internal Server Error.' });
     } else {
         data.joueurs = req.body.joueurs;
         data.save((err) => {
           if (err) {
             res.json({ success: false, message: 'Bad Request.' });
           } else {
             return res.json(data);
           }
         });
     }
    });
};

exports.RenameAdjointPlayer = (req,res) => {
    User.findOne({ _id: req.params.idUser }, function(err, data){
       if (err) {
           return res.json({ success: false, message: 'Internal Server Error.' });
       } else {
           data.joueur.type = 'Adjoint';
           data.save(function(error) {
               if (error) {
                   return res.json({ success: false, message: 'Internal Server Error.' });
               }else {
                   return res.json(data);
               }
           });
       }
    });
};
