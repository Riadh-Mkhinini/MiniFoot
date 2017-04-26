/*jshint esversion: 6 */
var express = require('express');
var notificationController = require('../controller/notificationController');

var routes = () => {
  var notificationRouter=express.Router();

  notificationRouter.post('/:from', notificationController.sendNotificationTeam);
  notificationRouter.get('/:idUser/invitations', notificationController.getNotificationPlayerTeam);
  notificationRouter.delete('/:idNotification/rejected', notificationController.deleteNotificationPlayerTeam);
  notificationRouter.put('/:idNotification/accepted', notificationController.acceptNotificationPlayerTeam);
  notificationRouter.post('/from/:idUser/to/:idEquipe', notificationController.rejoindreTeam);
  notificationRouter.put('', notificationController.acceptNotificationRejoindreTeam);
  notificationRouter.delete('', notificationController.deleteNotificationRejoindreTeam);

  return notificationRouter;
};
module.exports=routes;
