var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;
var User = require('./users').modelUser;

var stadeSchema=new Schema({
  name: String,
  user:{ type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type : Date },
  options: {
                vestaire: { type: Boolean, default: false },
                cafe: { type: Boolean, default: false },
                lumiere: { type: Boolean, default: false },
                arbitre: { type: Boolean, default: false }
           },
  tarton : String,
  lagitude: Number,
  longitude: Number,
  notes: [{ user: ObjectId, value: Number }],
  abonnees: [{ user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }}]
});

var modelStade = mongoose.model("Stade",stadeSchema);
module.exports = modelStade;
