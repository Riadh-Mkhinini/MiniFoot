var mongoose=require('mongoose');
var Schema=mongoose.Schema;
var ObjectId = Schema.ObjectId;
var User=require('./users').modelUser;

var friendsSchema=new Schema({
  user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User'
        },
  friends: [ {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User'
            } ]
});

var modelFriends=mongoose.model("Friends",friendsSchema);
module.exports = modelFriends;
