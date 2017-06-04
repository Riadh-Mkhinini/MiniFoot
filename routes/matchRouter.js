/*jshint esversion: 6 */
var express = require('express');
var matchController = require('../controller/matchController');

var routes = () => {
  var matchRouter = express.Router();
  matchRouter.post('/', matchController.addEvents);
  matchRouter.get('/:idStade', matchController.getAllEvents);
  matchRouter.delete('/:idMatch', matchController.deleteEvent);
  matchRouter.put('/:idMatch', matchController.updateEvent);
  matchRouter.get('/:idEquipe', matchController.getMesMatchs);
  matchRouter.get('/:idEquipe/myTeam', matchController.getMatchsMyEquipe);
  matchRouter.delete('/:idMatch/delete', matchController.deleteMatchById);
  matchRouter.put('/:idMatch/accept', matchController.acceptMatchById);
  matchRouter.put('/:idMatch/reserver', matchController.reserverStade);
  matchRouter.put('/:idMatch/score', matchController.addScoreMatch);
  matchRouter.get('/:idEquipe/terminated', matchController.getMatchsTeamTerminated);
  matchRouter.get('/:idStade/reserver', matchController.getEventReservation);
  matchRouter.put('/:idMatch/reservation', matchController.acceptReservation);

  return matchRouter;
};
module.exports = routes;
