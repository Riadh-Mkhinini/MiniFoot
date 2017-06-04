var NotificationFriends = require('../models/NotificationFriends');
var Friends = require('../models/Friends');
var mongoose=require('mongoose');
var User = require('../models/users');
var gcm = require('node-gcm');

exports.getInvitationsFriends=function (req,res) {
  NotificationFriends.find({ to:req.params.idUser, accepted: false })
  .limit(10).skip(req.query.page * 10).sort({ createdAt: -1 })
  .populate
  ({
      path:'from',
      select: ['_id', 'firstname', 'lastname', 'photo']
  })
  .exec(function(err,data) {
    if (err) {
      res.json({ success: false, message: 'Internal Server Error.' });
    }else {
      res.json(data);
    }
  });
}

exports.getFriends=function (req,res) {
  Friends.findOne({ user:req.params.idUser }, { friends: {$slice: [req.query.page * 10, 10]} }).populate('friends').exec(function(err,data) {
    if (err) {
      res.json({ success: false, message: 'Internal Server Error.' });
    }else {
      res.json(data);
    }
  });
}

exports.deleteFriend = function(req, res) {
  let idUser = req.query.idUser;
  let idFriend = req.query.idFriend;
  NotificationFriends.remove({ _id: req.params.idInvitation }, (err,notification)=>{
    if (err) {
      res.json({ success: false, message: 'Internal Server Error.' });
    }else{
        Friends.update( {user: idUser}, { $pull: { friends: idFriend } } ).then(function(result){
            Friends.update( {user: idFriend}, { $pull: { friends: idUser } } ).then(function(result){
              res.json({ success: true, message: 'success delete relationship between users .' });
            },function(error){
              res.json({ success: false, message: 'Internal Server Error.' });
            });
        },function(error){
          res.json({ success: false, message: 'Internal Server Error.' });
        });
    }
  });
};
