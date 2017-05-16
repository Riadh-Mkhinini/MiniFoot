var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;
var User = require('./users').modelUser;
var Equipe = require('./Equipe');

var rejoindreTeamSchema=new Schema({
    joinTeam: {
        from:{ type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        accepted: { type: Boolean, default: false }
    },
    joinMatch: {
        from:{ type: mongoose.Schema.Types.ObjectId, ref: 'Equipe' },
        accepted: { type: Boolean, default: false }
    },
    to: { type: mongoose.Schema.Types.ObjectId, ref: 'Equipe' },
    createdAt: { type : Date, default: Date.now },
    type: String
});

var modelRejoindreTeam = mongoose.model("RejoindreTeam",rejoindreTeamSchema);
module.exports = modelRejoindreTeam;
