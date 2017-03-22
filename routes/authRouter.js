/*jshint esversion: 6 */
var express=require('express');
var authController=require('../controller/authController');
var routes=()=>{
  var authRouter=express.Router();
  // Register new users
  authRouter.post('/register', authController.userRegister);
  // Authenticate the user and get a JSON Web Token to include in the header of future requests.
  authRouter.post('/authenticate',authController.userAuth);
  authRouter.post('/upload/:id',authController.updatePhoto);
  authRouter.get('/',authController.getAllUsers);
  authRouter.get('/:idUser',authController.getUserById);
  authRouter.put('/:idUser',authController.updateUser);
  authRouter.delete('/:idUser',authController.deleteUser);
return authRouter;
};
module.exports=routes;
