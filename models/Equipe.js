var mongoose=require('mongoose');
var Schema=mongoose.Schema;
var ObjectId = Schema.ObjectId;
var User=require('./users').modelUser;

var equipeSchema=new Schema({
  name:{type:String, required:true },
  adresse:String,
  logo:String,
  description:String,
  date_creation:{type : Date, default: Date.now },
  createdBy: {
          type:  mongoose.Schema.Types.ObjectId,
          ref: 'User'
        },
  joueurs: [ { idJoueur: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
               x: Number,
               y: Number
             }
           ]
});

equipeSchema.index({name: 'text'});
var modelEquipe=mongoose.model("Equipe",equipeSchema);
module.exports = modelEquipe;
