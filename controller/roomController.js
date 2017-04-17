var Room = require('../models/Room');
var Message = require('../models/Message');
var mongoose=require('mongoose');

exports.getAllRoomUser = function (req,res) {
  Room.find({ users :req.params.idUser }, function(err,data) {
    if (err) {
      res.json({ success: false, message: 'Internal Server Error.' });
    }else {
      res.json(data);
    }
  });
}

exports.getAllDiscussionUser = function (req,res) {
  Room.find({ users :req.params.idUser }).populate
    ({
      path: 'users',
      match: { _id: { $ne: req.params.idUser }},
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

exports.getDiscussionByIdFriend = function (req,res) {
  Room.findOne({ users :req.params.idUser, users: req.params.idFriend }).populate
    ({
      path: 'users',
      match: { _id: { $ne: req.params.idUser }},
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

exports.getMessagesByIdRoom = function (req,res) {
  let pageNumber=req.params.page;
  let nPerPage=10;
  Message.find({ idRoom :req.params.idRoom }, null, { sort: { createdAt: -1 }, skip: pageNumber * nPerPage, limit: nPerPage}, function(err,data) {
    if (err) {
      res.json({ success: false, message: 'Internal Server Error.' });
    }else {
      res.json(data);
    }
  });
}

exports.changeRoomToVue = function (req,res) {
  console.log(req.body);
  Room.update( {_id: req.params.idRoom}, { $set: {user: req.body}, vue: 1 } , function(err,data) {
    if (err) {
      res.json({ success: false, message: 'Internal Server Error.' });
    }else {
      res.json(data);
    }
  });
}
