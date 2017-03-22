/*jshint esversion: 6 */
var express=require('express');
var skillsController=require('../controller/skillsController');
var routes=()=>{
  var skillsRouter=express.Router();

  skillsRouter.post('/:idUser', skillsController.addSkills);

  return skillsRouter;
};
module.exports=routes;
