var mongoose=require('mongoose');
var Schema=mongoose.Schema;
var ObjectId = Schema.ObjectId;
var Equipe=require('./Equipe').modelUser;

var photosSchema=new Schema({
  photos: [String],
  equipe:{ type: mongoose.Schema.Types.ObjectId, ref: 'Equipe' }
});

var modelPhotos=mongoose.model("Photos",photosSchema);
module.exports = modelPhotos;
