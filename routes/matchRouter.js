/*jshint esversion: 6 */
var express = require('express');
var matchController = require('../controller/matchController');

var routes = () => {
  var matchRouter = express.Router();

  matchRouter.post('/', matchController.addEvents);
  matchRouter.get('/:idEquipe', matchController.getMesMatchs);
  matchRouter.get('/:idEquipe/myTeam', matchController.getMatchsMyEquipe);
  matchRouter.delete('/:idMatch/delete', matchController.deleteMatchById);
  matchRouter.put('/:idMatch/accept', matchController.acceptMatchById);
  matchRouter.put('/:idMatch/reserver', matchController.reserverStade);
  matchRouter.put('/:idMatch/score', matchController.addScoreMatch);
  matchRouter.get('/:idEquipe/terminated', matchController.getMatchsTeamTerminated);
  return matchRouter;
};

module.exports = routes;
