var mongoose=require('mongoose');
var Schema=mongoose.Schema;
var User=require('./users').modelUser;

var skillsSchema=new Schema({
  attaque: [Number],
  defence: [Number],
  milieu: [Number],
  gardien: [Number],
  noteTo:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
});

var modelSkills=mongoose.model("Skills",skillsSchema);
module.exports = modelSkills;
