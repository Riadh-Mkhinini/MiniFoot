var mongoose=require('mongoose');
var Schema=mongoose.Schema;
var User=require('./user').modelUser;

var competenceSchema=new Schema({
  attaque: [Number],
  defence: [Number],
  milieu: [Number],
  gardien: [Number],
  noteTo:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
});

var modelCompetences=mongoose.model("Competences",competenceSchema);
module.exports = modelCompetences;
