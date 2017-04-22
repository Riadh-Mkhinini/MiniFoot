var Notification = require('../models/Notification');
var Friends = require('../models/Friends');
var mongoose=require('mongoose');
var User = require('../models/users');
var gcm = require('node-gcm');
const API_KEY = 'AAAA8Hxw8z8:APA91bFkCNJccW6C8RPY9A4S5zxsxsASqlnGc5CRgLsb4WEhPxYg7H0HfTnc4MkkmUVNsZfpzevIWifsN6G0jFXciF3EcP9yAMZqWKHBvEQj14bfKWM0bUMHu4azUkcqIf9i_g5vlITZ';

exports.sendNotificationTeam = function(req, res) {
  req.body.users.forEach((item) => {
      var notification = new Notification({
          rejoin: {from: req.params.from, to: item }
      });
      notification.save((err) => {(err) ? console.log(err) : console.log()});
  });
  var message = new gcm.Message({
      data: {
        title : req.body.title,
        message : "Vous a envoyé une invitation de rejoindre son équipe"
      }
  });
  var sender = new gcm.Sender(API_KEY);
  var registrationIds = req.body.tokens;
  sender.sendNoRetry(message, { registrationIds: registrationIds }, function(err, response) {
    if(err) return res.json({ success: false });
    else   return res.json({ success: true });
  });
};
