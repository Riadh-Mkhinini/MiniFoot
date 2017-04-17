var mongoose=require('mongoose');
var Schema=mongoose.Schema;
var User=require('./users').modelUser;

var roomSchema=new Schema({
  users:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
        }],
  message: String,
  createdAt: { type : Date, default: Date.now },
  user: { _id: { type: mongoose.Schema.Types.ObjectId, ref: 'User'},
          name: String,
          avatar: String
        },
  vue: Number
});

var modelRooms=mongoose.model("Room",roomSchema);
module.exports = modelRooms;
