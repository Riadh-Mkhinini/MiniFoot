/*jshint esversion: 6 */
var express = require('express');
var matchController = require('../controller/matchController');

var routes = () => {
  var matchRouter = express.Router();
  matchRouter.post('/', matchController.addEvents);
  return matchRouter;
};

module.exports = routes;
