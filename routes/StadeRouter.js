/*jshint esversion: 6 */
var express = require('express');
var stadeController = require('../controller/stadeController');

var routes = () => {
  var stadeRouter = express.Router();
  stadeRouter.get('/:idStade', stadeController.getStadeById);
  stadeRouter.put('/:idStade', stadeController.updateStade);
  stadeRouter.get('/:idStade/abonnees', stadeController.getListAbonneesStade);
  // upload Photos
  stadeRouter.get('/stadeUploads/:id', stadeController.getPhotoStade);
  stadeRouter.post('/stadeUploads/:id/photos', stadeController.addPhotosStade);
  stadeRouter.get('/:idStade/photos', stadeController.getImagesStade);

  return stadeRouter;
};

module.exports = routes;
