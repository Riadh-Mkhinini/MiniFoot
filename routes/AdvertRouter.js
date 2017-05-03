/*jshint esversion: 6 */
var express = require('express');
var advertsController = require('../controller/advertsController');

var routes = () => {
  var advertRouter = express.Router();
  // get all advert by page
  advertRouter.get('/', advertsController.getAllAdverts);

  return advertRouter;
};

module.exports = routes;
