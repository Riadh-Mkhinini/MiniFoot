/*jshint esversion: 6 */
var express=require('express');
var authController=require('../controller/authController');
var userController=require('../controller/userController');
var skillsController=require('../controller/skillsController');

var routes=()=>{
  var authRouter=express.Router();
  // Register new users
  authRouter.post('/register', authController.userRegister);
  // Authenticate the user and get a JSON Web Token to include in the header of future requests.
  authRouter.post('/authenticate',authController.userAuth);
  //Upload image user
  authRouter.post('/users/upload/:id',userController.updatePhoto);
  authRouter.get('/users/upload/:id',userController.getPhoto);

  authRouter.get('/users/',userController.getAllUsers);
  authRouter.get('/users/:idUser',userController.getUserById);
  authRouter.put('/users/:idUser',userController.updateUser);
  authRouter.delete('/users/:idUser',userController.deleteUser);
  //skills of user
  authRouter.post('/users/:idUser/skills', skillsController.addSkills);
  authRouter.get('/users/:idUser/skills', skillsController.getSkills);
  return authRouter;
};
module.exports=routes;
