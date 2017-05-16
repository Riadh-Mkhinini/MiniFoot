/*jshint esversion: 6 */
var express = require('express');
var stadeController = require('../controller/stadeController');

var routes = () => {
  var stadeRouter = express.Router();
  stadeRouter.get('/:idStade', stadeController.getStadeById);
  stadeRouter.put('/:idStade', stadeController.updateStade);
  stadeRouter.get('/:idStade/abonnees', stadeController.getListAbonneesStade);
  stadeRouter.put('/:idStade/notes', stadeController.addNoteToStade);
  stadeRouter.put('/:idStade/abonnees', stadeController.addAbonneeStade);
  // upload Photos
  stadeRouter.get('/stadeUploads/:id', stadeController.getPhotoStade);
  stadeRouter.post('/stadeUploads/:id/photos', stadeController.addStadePhotos);
  stadeRouter.get('/:idStade/photos', stadeController.getImagesStade);

  return stadeRouter;
};

module.exports = routes;
