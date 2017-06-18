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
  joueurs: [ { idJoueur: { type: mongoose.Schema.Types.ObjectId, ref: 'User' } }],
  formation: [ { idJoueur: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
                 pan: { x: { type : Number, default: 0 }, y: { type : Number, default: 0 } }
                 //position: { top: { type : Number, default: 0 }, center: { type : Number, default: 0 }, bottom: { type : Number, default: 0 } }
               }
             ]

});

equipeSchema.index({name: 'text'});
var modelEquipe=mongoose.model("Equipe",equipeSchema);
module.exports = modelEquipe;
