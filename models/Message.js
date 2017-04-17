var mongoose=require('mongoose');
var Schema=mongoose.Schema;
var User=require('./users').modelUser;
var Room=require('./Room');

var messageSchema=new Schema({
  idRoom: { type: mongoose.Schema.Types.ObjectId, ref: 'Room'},
  text: String,
  createdAt: { type : Date, default: Date.now } ,
  user: {
    _id: { type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    name: String,
    avatar: String
  }
});

var modelMessage = mongoose.model("Messages",messageSchema);
module.exports = modelMessage;
