/*jshint esversion: 6 */
var express=require('express');
var authController=require('../controller/authController');
var skillsController=require('../controller/skillsController');

var routes=()=>{
  var authRouter=express.Router();
  // Register new users
  authRouter.post('/register', authController.userRegister);
  // Authenticate the user and get a JSON Web Token to include in the header of future requests.
  authRouter.post('/authenticate',authController.userAuth);
  //Upload image user
  authRouter.post('/upload/:id',authController.updatePhoto);

  authRouter.get('/',authController.getAllUsers);
  authRouter.get('/:idUser',authController.getUserById);
  authRouter.put('/:idUser',authController.updateUser);
  authRouter.delete('/:idUser',authController.deleteUser);
  //skills of user
  authRouter.post('/:idUser/skills', skillsController.addSkills);
  authRouter.get('/:idUser/skills', skillsController.getSkills);
  return authRouter;
};
module.exports=routes;
