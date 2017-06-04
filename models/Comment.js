var mongoose=require('mongoose');
var Schema=mongoose.Schema;
var ObjectId = Schema.ObjectId;
var Advert = require('./Advert');
var User = require('./users');

var CommentSchema=new Schema({
    advert: { type: mongoose.Schema.Types.ObjectId, ref: 'Advert' },
    description: String,
    createdAt: { type : Date, default: Date.now },
    postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

var modelComment = mongoose.model("Comments", CommentSchema);
module.exports = modelComment;
