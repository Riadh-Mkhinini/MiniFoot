var mongoose=require('mongoose');
var Schema=mongoose.Schema;
var ObjectId = Schema.ObjectId;
var Equipe = require('./Equipe');
var User = require('./users');
var Stade = require('./Stade');

var AdvertSchema=new Schema({
    advertTeam: {
        createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Equipe' },
        description: String,
        disponibility: [String],
        interested: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
    },
    advertUser: {
        createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        description: String,
    },
    advertEvent: {
        createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Stade' },
        title: String,
        description: String,
        image: String,
        dateBegin: { type : Date },
        dateEnd: { type : Date }
    },
    createdAt: { type : Date, default: Date.now },
    type: String
});

var modelAdvert = mongoose.model("Advert", AdvertSchema);
module.exports = modelAdvert;
