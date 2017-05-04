/*jshint esversion: 6 */
var express = require('express');
var advertsController = require('../controller/advertsController');

var routes = () => {
  var advertRouter = express.Router();
  // get all advert by page
  advertRouter.get('/', advertsController.getAllAdverts);
  // get adverts of team
  advertRouter.get('/:idEquipe', advertsController.geAdvertsOfTeam);
  return advertRouter;
};

module.exports = routes;
