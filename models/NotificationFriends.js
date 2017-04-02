var mongoose=require('mongoose');
var Schema=mongoose.Schema;
var ObjectId = Schema.ObjectId;
var User=require('./users').modelUser;

var notificationFriendsSchema=new Schema({
  from:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
  to: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
  accepted: { type: Boolean, default: false }
});

var modelNotificationFriends=mongoose.model("NotificationFriends",notificationFriendsSchema);
module.exports = modelNotificationFriends;
