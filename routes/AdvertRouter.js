/*jshint esversion: 6 */
var express = require('express');
var advertsController = require('../controller/advertsController');

var routes = () => {
  var advertRouter = express.Router();
  // get all advert by page
  advertRouter.get('/', advertsController.getAllAdverts);
  // get adverts of team
  advertRouter.get('/:idEquipe', advertsController.geAdvertsOfTeam);
  // add new interssted
  advertRouter.post('/:idAdvert', advertsController.addInterrestedAdverts);
  // delete intressted
  advertRouter.delete('/:idAdvert', advertsController.deleteInterrestedAdverts);
  // get list interssted advert by id
  advertRouter.get('/:idAdvert/interssted', advertsController.getListInteresstedAdverts);

  return advertRouter;
};

module.exports = routes;
