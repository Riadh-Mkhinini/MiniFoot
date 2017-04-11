/*jshint esversion: 6 */
var express=require('express');
var equipeController=require('../controller/equipeController');

var routes=()=>{
  var equipeRouter=express.Router();
  // get All equipe
  equipeRouter.post('/equipe',equipeController.createEquipe);
  equipeRouter.get('/equipe',equipeController.getAllEquipe);
  equipeRouter.get('/equipe/:idEquipe',equipeController.getEquipeById);
  equipeRouter.put('/equipe/:idEquipe',equipeController.addJoueur);

  return equipeRouter;
};
module.exports=routes;
