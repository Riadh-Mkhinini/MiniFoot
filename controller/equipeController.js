var Equipe = require('../models/Equipe');
var User = require('../models/users');
var Photos = require('../models/Photos');
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
var uploadMultiple = multer({storage: storage}).array('photo', 10);

exports.getPhoto=function (req, res) {
  fs.createReadStream(path.join('./teamUploads', req.params.id)).pipe(res);
};

exports.getImagesTeam=function (req, res) {
  Photos.findOne({ equipe:req.params.idEquipe}).exec(function(err,data){
    if (err) {
      return res.json({ success: false, message: 'Equipe not found.' });
    } else {
      return res.json(data);
    }
  });
};

exports.updatePhoto=function (req, res) {
  upload(req, res, function(err) {
    if(err) {
      return err;
    }
    Equipe.findOneAndUpdate({_id:req.params.id},{$set:{logo:req.file.filename}},function (err,response) {
      if (err) {
        return res.json({ success: false, message: 'Equipe not found.' });
      } else {
          response.logo = req.file.filename;
          return res.json({ success: true, message: response});
      }
    });
  });
};

exports.addPhotos=function (req, res) {
  upload(req, res, function(err) {
    if(err) {
      return err;
    }
    Photos.findOneAndUpdate({ equipe: req.params.id },{$push: { photos: req.file.filename}}, function(err,data){
        if (err) {
            return res.json({ success: false, message: 'Stade not found.' });
        } else {
            return res.json({imageName: req.file.filename});
        }
    });
  });
};
exports.deletePhotoTeam=function (req, res) {
    Photos.findOneAndUpdate({ equipe: req.params.id },{$pull: { photos: req.params.idPhoto}}, function(err,data){
        if (err) {
            return res.json({ success: false, message: 'Stade not found.' });
        } else {
            return res.json(data);
        }
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
                 data.equipe = equipe._id;
                 data.save(function(error) {
                     if (error) {
                         return res.json({ success: false, message: 'Internal Server Error.' });
                     }else {
                       var photos= new Photos({ equipe: data.equipe });
                       photos.save((err)=>{err : console.log(err);});
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
  Equipe.find({ $or: [{name: new RegExp(req.query.name, 'i')},
                      {adresse: new RegExp(req.query.name, 'i')}
                     ]})
  .limit(10).skip(req.query.page * 10)
  .exec((err,data)=>{
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
        path:'joueurs.idJoueur'
    })
      .exec(function(err, data) {
        if (err) {
          res.status(500).send(err);
        }else {
          res.status(200).json(data);
        }
      });
};

exports.getMembresEquipeById = (req,res) => {
  idEquipe=req.params.idEquipe;
  Equipe.findById(idEquipe).select('joueurs').populate
    ({
        path:'joueurs.idJoueur',
        select: ['_id', 'firstname', 'lastname', 'photo', 'city', 'joueur']
    })
      .exec(function(err, data) {
        if (err) {
          res.status(500).send(err);
        }else {
          res.status(200).json(data);
        }
      });
}

exports.getFormationEquipeById = (req,res) => {
  idEquipe=req.params.idEquipe;
  Equipe.findById(idEquipe).select('formation').populate
    ({
        path:'formation.idJoueur',
        select: ['_id', 'firstname', 'photo']
    })
      .exec(function(err, data) {
        if (err) {
          res.status(500).send(err);
        }else {
          res.status(200).json(data);
        }
      });
}

exports.updateTeam= (req,res) => {
    var idEquipe=req.params.idEquipe;
    Equipe.findOneAndUpdate({ _id:idEquipe },
       { "$set": { "name": req.body.name, "adresse": req.body.adresse, "description": req.body.description}})
    .exec(function(err, data){
       if(err) {
               res.send({ success: false, message: 'Internal Server Error.' });
       } else {
                res.json({success: true, message: 'Team update'});
       }
    });
};

exports.updateJoueurs = (req,res) => {
    var idEquipe = req.params.idEquipe;
    Equipe.findOne({ _id: idEquipe }, (err, data) => {
     if (err) {
       res.send({ success: false, message: 'Internal Server Error.' });
     } else {
         data.formation = req.body.formation;
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
           data.joueur.type = 'Sous Responsable';
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

exports.renameCapitaineTeam = (req,res) => {
    User.findOne({ _id: req.params.idJoueur }, function(err, user) {
       if (err) {
           return res.json({ success: false, message: 'Internal Server Error.' });
       } else {
           user.joueur.type = 'Responsable';
           user.save(function(error) {
               if (error) {
                   return res.json({ success: false, message: 'Internal Server Error.' });
               } else {
                   User.findOne({ _id: req.params.idCapitaine }, function(err, player) {
                      if (err) {
                          return res.json({ success: false, message: 'Internal Server Error.' });
                      } else {
                          player.joueur.type = 'Joueur';
                          player.save(function(error) {
                              if (error) {
                                  return res.json({ success: false, message: 'Internal Server Error.' });
                              } else {
                                      Equipe.findOneAndUpdate({ _id: req.params.idEquipe }, { "$set": { "createdBy": req.params.idJoueur } }, function(err,equipe) {
                                          if (err) {
                                              return res.json({ success: false, message: 'Internal Server Error.' });
                                          } else {
                                              return res.json({ success: true, message: equipe });
                                          }
                                      });
                              }
                            });
                      }
                    });
              }
           });
        }
      });
};

exports.quitEquipe = (req,res) => {
    Equipe.update( { _id: req.params.idEquipe }, { $pull: { joueurs: { idJoueur: req.params.idJoueur } } } ).then(function(result){
        User.findOne({ _id: req.params.idJoueur }, function(err, data){
           if (err) {
               return res.json({ success: false, message: 'Internal Server Error.' });
           } else {
               data.joueur.type = 'Joueur';
               data.equipe = undefined;
               data.save(function(error) {
                   if (error) {
                       return res.json({ success: false, message: 'Internal Server Error.' });
                   }else {
                       return res.json(data);
                   }
               });
           }
        });
    },function(error){
      res.json({ success: false, message: 'Internal Server Error.' });
    });
};
