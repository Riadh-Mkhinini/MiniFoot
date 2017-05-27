var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;
var User = require('./users').modelUser;

var stadeSchema=new Schema({
  name: String,
  adresse: String,
  city: String,
  user:{ type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type : Date },
  options: {
                vestiaire: { type: Boolean, default: false },
                cafe: { type: Boolean, default: false },
                lumiere: { type: Boolean, default: false },
                arbitre: { type: Boolean, default: false }
           },
  tarton : String,
  latitude: { type: Number, default: 0},
  longitude: { type: Number, default: 0},
  notes: [{ user: ObjectId, value: Number }],
  abonnees: [{ user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }}],
  photos: [String],
  tarif: Number,
  phone:Number
});

stadeSchema.index({name: 'text'});

var modelStade = mongoose.model("Stade",stadeSchema);
module.exports = modelStade;
