/*jshint esversion: 6 */
var express = require('express');
var advertsController = require('../controller/advertsController');
var commentController = require('../controller/commentController');


var routes = () => {
  var advertRouter = express.Router();
  // get all advert with pagination
  advertRouter.get('/', advertsController.getAllAdverts);
  // get all advert user
  advertRouter.get('/:idUser/joueur', advertsController.getAllAdvertsUser);
  // get adverts of team
  advertRouter.get('/:idEquipe', advertsController.geAdvertsOfTeam);
  // add new interssted
  advertRouter.post('/:idAdvert', advertsController.addInterrestedAdverts);
  // delete intressted
  advertRouter.delete('/:idAdvert', advertsController.deleteInterrestedAdverts);
  // get list interssted advert by id
  advertRouter.get('/:idAdvert/interssted', advertsController.getListInteresstedAdverts);
  // delete advert
  advertRouter.delete('/:idAdvert/delete', advertsController.deleteAdvertyId);
  // add advert event
  advertRouter.post('/uploadEvent/:id',advertsController.addAdvertEvenementWithPicture);
  advertRouter.post('/advertEvent/:id', advertsController.addAdvertEvenement);
  advertRouter.get('/advertEvent/:id', advertsController.getListEvents);
  advertRouter.get('/uploadEvent/:id',advertsController.getPhoto);
  //comments
  advertRouter.get('/:idAdvert/comments', commentController.getListComment);
  advertRouter.post('/:idAdvert/comments', commentController.addCommentAdvertEvenement);
  advertRouter.delete('/comments/:idComment', commentController.deleteCommentAdvert);

  return advertRouter;
};

module.exports = routes;
