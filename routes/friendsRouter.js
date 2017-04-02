/*jshint esversion: 6 */
var express=require('express');
var notificationFriendsController=require('../controller/notificationFriendsController');
var friendsController=require('../controller/friendsController');

var routes=()=>{
  var friendsRouter=express.Router();
  // add user invitation to other user
  friendsRouter.post('/:idUser/notificate', notificationFriendsController.addFriendsNotification);
  // reject user invitation
  friendsRouter.delete('/:idInvitation/rejected', notificationFriendsController.deleteFriendsNotification);
  // accept user invitation
  friendsRouter.put('/:idInvitation/accepted', notificationFriendsController.acceptFriendsNotification);
  // get relationship between users
  friendsRouter.get('/:idUser/relationship/:idFriend', notificationFriendsController.getRelationshipUser);
  // get list invitation friends user
  friendsRouter.get('/:idUser/invitations', friendsController.getInvitationsFriends);
  // get list friends user
  friendsRouter.get('/:idUser', friendsController.getFriends);
  //delete relationship between users
  friendsRouter.delete('/:idInvitation',friendsController.deleteFriend);

  return friendsRouter;
};
module.exports=routes;
