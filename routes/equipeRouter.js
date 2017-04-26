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
  //formation equipe
  equipeRouter.get('/:idEquipe/formation',equipeController.getFormationEquipeById);
  equipeRouter.put('/:idEquipe/formation',equipeController.updateJoueurs);
  //update players of team
  equipeRouter.put('/:idEquipe/players/:idJoueur/delete',equipeController.quitEquipe)
  //Rename type Player
  equipeRouter.put('/:idUser/rename',equipeController.RenameAdjointPlayer);
  equipeRouter.put('/:idEquipe/capitaine/:idCapitaine/to/:idJoueur',equipeController.renameCapitaineTeam);
  //logo upload
  equipeRouter.post('/teamUploads/:id',equipeController.updatePhoto);
  equipeRouter.get('/teamUploads/:id',equipeController.getPhoto);
  // upload Photos
  equipeRouter.post('/teamUploads/:id/photos',equipeController.addPhotos);
  equipeRouter.get('/:idEquipe/photos',equipeController.getImagesTeam);

  return equipeRouter;
};
module.exports=routes;
