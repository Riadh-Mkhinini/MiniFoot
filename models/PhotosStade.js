var mongoose=require('mongoose');
var Schema=mongoose.Schema;
var ObjectId = Schema.ObjectId;
var Stade = require('./Stade');

var photosStadeSchema=new Schema({
  photos: [String],
  stade:{ type: mongoose.Schema.Types.ObjectId, ref: 'Stade' }
});

var modelPhotosStade = mongoose.model("PhotosStade",photosStadeSchema);
module.exports = modelPhotosStade;
