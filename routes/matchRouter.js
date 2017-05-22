/*jshint esversion: 6 */
var express = require('express');
var matchController = require('../controller/matchController');

var routes = () => {
  var matchRouter = express.Router();
  matchRouter.post('/', matchController.addEvents);
  matchRouter.get('/:idStade', matchController.getAllEvents);
  matchRouter.delete('/:idMatch', matchController.deleteEvent);
  matchRouter.put('/:idMatch', matchController.updateEvent);

  return matchRouter;
};

module.exports = routes;
