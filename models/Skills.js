var mongoose=require('mongoose');
var Schema=mongoose.Schema;
var ObjectId = Schema.ObjectId;
var User=require('./users').modelUser;

var skillsSchema=new Schema({
  attaque: [{ObjectId, Number}],
  defence: [{ObjectId, Number}],
  milieu: [{ObjectId, Number}],
  gardien: [{ObjectId, Number}],
  noteTo:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
});

var modelSkills=mongoose.model("Skills",skillsSchema);
module.exports = modelSkills;
