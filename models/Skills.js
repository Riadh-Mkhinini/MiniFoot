var mongoose=require('mongoose');
var Schema=mongoose.Schema;
var ObjectId = Schema.ObjectId;
var User=require('./users').modelUser;

var skillsSchema=new Schema({
  attaque: [{user:ObjectId, value:Number}],
  defence: [{user:ObjectId, value:Number}],
  milieu: [{user:ObjectId, value:Number}],
  gardien: [{user:ObjectId, value:Number}],
  noteTo:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
});

var modelSkills=mongoose.model("Skills",skillsSchema);
module.exports = modelSkills;
