var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;
var User = require('./users').modelUser;
var Equipe = require('./Equipe');

var notificationSchema=new Schema({
  rejoin: {
              from:{
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'Equipe'
                  },
              to: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'User'
                  },
              accepted: { type: Boolean, default: false }
          }
});

var modelNotification = mongoose.model("Notification",notificationSchema);
module.exports = modelNotification;
