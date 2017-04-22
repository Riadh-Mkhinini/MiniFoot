/*jshint esversion: 6 */
var express = require('express');
var notificationController = require('../controller/notificationController');

var routes = () => {
  var notificationRouter=express.Router();

  notificationRouter.post('/:from', notificationController.sendNotificationTeam);

  return notificationRouter;
};
module.exports=routes;
