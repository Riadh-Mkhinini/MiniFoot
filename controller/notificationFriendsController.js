var NotificationFriends = require('../models/NotificationFriends');
var Friends = require('../models/Friends');
var mongoose=require('mongoose');
var User = require('../models/users');
var gcm = require('node-gcm');
var Room = require('../models/Room');

exports.addFriendsNotification = function(req, res) {
  var notification = new NotificationFriends({
    from: req.params.idUser,
    to: req.query.to,
  });

  notification.save(function(err) {
    if (err) {
      console.log(err);
    }else{
      User.findById(req.query.to,(err,user)=>{
        var message = new gcm.Message({
            data: {
              title : req.body.title,
              message : "vous a envoyé une invitation d'amitié",
              smallIcon: req.body.photo,
              tag: 'USER'
            }
        });
        var sender = new gcm.Sender('AAAA8Hxw8z8:APA91bFkCNJccW6C8RPY9A4S5zxsxsASqlnGc5CRgLsb4WEhPxYg7H0HfTnc4MkkmUVNsZfpzevIWifsN6G0jFXciF3EcP9yAMZqWKHBvEQj14bfKWM0bUMHu4azUkcqIf9i_g5vlITZ');
        var registrationIds = [];
        registrationIds.push(user.token);
        sender.sendNoRetry(message, { registrationIds: registrationIds }, function(err, response) {
          if(err) console.error(err);
          else   return res.json({ success: true, data: notification });
        });

      });
    }
  });
};

exports.deleteFriendsNotification = function(req, res) {
  NotificationFriends.remove({ _id: req.params.idInvitation }, (err,notification)=>{
    if (err) {
      res.json({ success: false, message: 'Internal Server Error.' });
    }else{
        res.json({ success: true, message: 'No Content.' });
    }
  });
};

exports.acceptFriendsNotification = function(req, res) {

  Friends.findOneAndUpdate({ user: req.body.idUser }, { "$push": { "friends": req.body.friend } }, function(err,friends) {
    if (err) {
      return res.json({ success: false, message: 'Internal Server Error.' });
    }else {
      Friends.findOneAndUpdate({ user: req.body.friend }, { "$push": { "friends": req.body.idUser } }, function(err,friends) {
        if (err) {
          return res.json({ success: false, message: 'Internal Server Error.' });
        }
        else {
          NotificationFriends.findOneAndUpdate({ _id: req.params.idInvitation }, {"$set": { accepted: true }}, (err,notification)=>{
            if (err) {
              return res.json({ success: false, message: 'Internal Server Error.' });
            }else{
                var tabUsers = [];
                tabUsers.push(req.body.friend);
                tabUsers.push(req.body.idUser);
                var newRoom = new Room({
                  users: tabUsers,
                  message : 'Envoyer votre premier message',
                  user: { _id: req.body.friend, name: '', avatar: ''},
                  vue: 0
                });
                newRoom.save((err)=>{err : console.log(err);});
                return res.json(newRoom);
            }
          });
        }
      });
    }
  });
};

exports.getRelationshipUser = function(req, res){
  NotificationFriends.findOne({ to: req.params.idUser, from: req.params.idFriend }, (err,data)=>{
    if (err) {
      res.json({ success: false, message: 'Internal Server Error.' });
    }else{
        if (data === null) {
          NotificationFriends.findOne({ to: req.params.idFriend, from: req.params.idUser }, (err,invitation)=>{
            if (err) {
              res.json({ success: false, message: 'Internal Server Error.' });
            }else{
              if (invitation === null) {
                res.json({ success: false, message: 'no relationship between user' })
              }else {
                res.json({success: true, data: invitation});
              }
            }
          });
        }else {
          res.json({success: true, data});
        }
    }
  });
};
