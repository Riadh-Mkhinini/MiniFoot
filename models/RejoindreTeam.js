var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;
var User = require('./users').modelUser;
var Equipe = require('./Equipe');

var rejoindreTeamSchema=new Schema({
      from:{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
          },
      to: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Equipe'
          },
      accepted: { type: Boolean, default: false },

    createdAt: { type : Date, default: Date.now }
});

var modelRejoindreTeam = mongoose.model("RejoindreTeam",rejoindreTeamSchema);
module.exports = modelRejoindreTeam;
