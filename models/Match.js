var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;
var Equipe = require('./Equipe');
var Stade = require('./Stade');

var matchSchema = new Schema({
  teamOne: { type: mongoose.Schema.Types.ObjectId, ref: 'Equipe' },
  teamTow: { type: mongoose.Schema.Types.ObjectId, ref: 'Equipe' },
  scoreOne: { type: Number, default: 0 },
  scoreTow: { type: Number, default: 0 },
  createdAt: { type : Date, default: Date.now },
  stade: { type: mongoose.Schema.Types.ObjectId, ref: 'Stade' },
  etat: { type: Number, default: 0 },
  event: {
    start: Date,
    end: Date
  },
  date: Date,
  message: String
});

var modelMatch = mongoose.model("Matchs", matchSchema);
module.exports = modelMatch;
