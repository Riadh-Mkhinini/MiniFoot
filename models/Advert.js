var mongoose=require('mongoose');
var Schema=mongoose.Schema;
var ObjectId = Schema.ObjectId;
var Equipe = require('./Equipe');
var User = require('./users');

var AdvertSchema=new Schema({
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Equipe' },
  description: String,
  disponibility: [String],
  createdAt: { type : Date, default: Date.now },
  interested: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
});

var modelAdvert = mongoose.model("Advert", AdvertSchema);
module.exports = modelAdvert;
