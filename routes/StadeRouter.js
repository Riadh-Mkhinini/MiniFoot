/*jshint esversion: 6 */
var express = require('express');
var stadeController = require('../controller/stadeController');

var routes = () => {
  var stadeRouter = express.Router();
  stadeRouter.get('/:idStade', stadeController.getStadeById);
  stadeRouter.get('/', stadeController.getAllStades);
  stadeRouter.put('/:idStade', stadeController.updateStade);
  stadeRouter.get('/:idStade/abonnees', stadeController.getListAbonneesStade);
  stadeRouter.put('/:idStade/notes', stadeController.addNoteToStade);
  stadeRouter.put('/:idStade/like/:idUser', stadeController.addAbonneeStade);
  stadeRouter.put('/:idStade/deslike/:idUser', stadeController.deleteAbonneeStade);
  stadeRouter.get('/:idStade/abonnees/:idUser', stadeController.getAbonneesStade);
  stadeRouter.get('/:idStade/matchs', stadeController.getMatchStadeByDay);
  // upload Photos
  stadeRouter.get('/stadeUploads/:id', stadeController.getPhotoStade);
  stadeRouter.post('/stadeUploads/:id/photos', stadeController.addStadePhotos);
  stadeRouter.get('/:idStade/photos', stadeController.getImagesStade);

  return stadeRouter;
};

module.exports = routes;
