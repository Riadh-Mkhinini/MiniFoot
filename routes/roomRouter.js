/*jshint esversion: 6 */
var express = require('express');
var roomController = require('../controller/roomController');

var routes=()=>{
  var roomRouter=express.Router();

  roomRouter.get('/:idUser', roomController.getAllRoomUser);
  roomRouter.get('/:idUser/discussion', roomController.getAllDiscussionUser);
  roomRouter.get('/:idUser/discussion/:idFriend', roomController.getDiscussionByIdFriend);
  roomRouter.get('/:idRoom/messages/:page', roomController.getMessagesByIdRoom);
  roomRouter.put('/:idRoom/vue', roomController.changeRoomToVue);
  roomRouter.put('/:idRoom/update', roomController.updateRoom);

  return roomRouter;
};
module.exports=routes;
