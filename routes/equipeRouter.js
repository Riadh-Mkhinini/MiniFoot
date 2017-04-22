/*jshint esversion: 6 */
var express=require('express');
var equipeController=require('../controller/equipeController');

var routes=()=>{
  var equipeRouter=express.Router();
  // get All equipe
  equipeRouter.post('/',equipeController.createEquipe);
  equipeRouter.get('/',equipeController.getAllEquipe);
  equipeRouter.get('/:idEquipe',equipeController.getEquipeById);
  equipeRouter.get('/:idEquipe/membres',equipeController.getMembresEquipeById);
  equipeRouter.put('/:idEquipe',equipeController.updateTeam);
  //update players of team
  equipeRouter.put('/:idEquipe/players',equipeController.updateJoueurs);
  equipeRouter.put('/:idEquipe/players/:idJoueur/delete',equipeController.quitEquipe)
  //Rename type Player
  equipeRouter.put('/:idUser/rename',equipeController.RenameAdjointPlayer);
  equipeRouter.put('/:idEquipe/capitaine/:idCapitaine/to/:idJoueur',equipeController.renameCapitaineTeam);
  //logo upload
  equipeRouter.post('/teamUploads/:id',equipeController.updatePhoto);
  equipeRouter.get('/teamUploads/:id',equipeController.getPhoto);

  return equipeRouter;
};
module.exports=routes;
