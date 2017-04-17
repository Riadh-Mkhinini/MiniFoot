/*jshint esversion: 6 */
var express=require('express');
var equipeController=require('../controller/equipeController');

var routes=()=>{
  var equipeRouter=express.Router();
  // get All equipe
  equipeRouter.post('/',equipeController.createEquipe);
  equipeRouter.get('/',equipeController.getAllEquipe);
  equipeRouter.get('/:idEquipe',equipeController.getEquipeById);
  //update players of team
  equipeRouter.put('/:idEquipe/players',equipeController.updateJoueurs);
  //Rename type Player
  equipeRouter.put('/:idUser/rename',equipeController.RenameAdjointPlayer); 
  //logo upload
  equipeRouter.post('/upload/:id',equipeController.updatePhoto);
  equipeRouter.get('/upload/:id',equipeController.getPhoto);


  return equipeRouter;
};
module.exports=routes;
