var Equipe = require('../models/Equipe');
var mongoose=require('mongoose');

exports.createEquipe = (req,res) => {
  let equipe=new Equipe(req.body);
  if (!req.body.name) {
      res.json({ success: false, message: 'Svp choisir un nom pour votre équipe.' });
  }else {
    equipe.save((err) => {
      if(err){
        res.json({ success: false, message: 'Bad Request.' });
      }else{
        return res.status(200).json(equipe);
    }
  });
}
};

exports.getAllEquipe = (req,res) => {
  Equipe.find().populate({path:'createdBy'})
      .exec(function(err, data) {
        if (err) {
          res.json({ success: false, message: 'Bad request' });
        }else {
          res.json(data);
        }
      });
};

exports.getEquipeById = (req,res) => {
  idEquipe=req.params.idEquipe;
  Equipe.findById(idEquipe).populate({path:'createdBy'}).populate({path:'joueurs'})
      .exec(function(err, data) {
        if (err) {
          res.status(500).send(err);
        }else {
          res.status(200).json(data);
        }
      });
};

exports.addJoueur = (req,res) => {
  var idEquipe=req.params.idEquipe;



/*   Equipe.findOneAndUpdate({idEquipe},{ $push: { joueurs: req.body.joueurs } }).populate({path:'joueurs'})
      .exec(function(err, data) {
          if (err) {
            res.json(err);
          }else {
              console.log(data.value);
           res.json(data.value);
          }
        });*/
       Equipe.findOne(({idEquipe}).populate({path:'joueurs'}),(err,data)=>{
          console.log();
         if (err) {
           res.send({ success: false, message: 'Internal Server Error.' });
         }else{

           data.joueurs.push( req.body.joueurs );
              console.log(data.joueurs);
             data.save((err)=>{
               if(err){
                 res.json({ success: false, message: 'Bad Request.' });
                   console.log("errrrrrrrrrrr");
               }else{
                 return res.json(data);
                 console.log("succsssssssssssss");
                 }
             });
         }
   });

};

exports.updateEquipe = (req,res) => {

};
exports.deleteEquipe = (req,res) => {

};
