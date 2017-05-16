/*jshint esversion: 6 */
var express = require('express');
var notificationController = require('../controller/notificationController');

var routes = () => {
  var notificationRouter=express.Router();

  notificationRouter.post('/:from', notificationController.sendNotificationTeam);
  notificationRouter.get('/:idUser/invitations', notificationController.getNotificationPlayerTeam);
  notificationRouter.delete('/:idNotification/rejected', notificationController.deleteNotificationPlayerTeam);
  notificationRouter.put('/:idNotification/accepted', notificationController.acceptNotificationPlayerTeam);
  //RejoindreTeam
  notificationRouter.put('/:idRejoindreTeam/accept', notificationController.acceptNotificationRejoindreTeam);
  notificationRouter.delete('/:idRejoindreTeam', notificationController.deleteNotificationRejoindreTeam);
  notificationRouter.get('/:idEquipe/invitationsRejoindre', notificationController.getNotificationRejoindre);
  notificationRouter.get('/:idUser/playerBelongsTeam/:idEquipe', notificationController.getPlayerInTeam);

  return notificationRouter;
};
module.exports=routes;
