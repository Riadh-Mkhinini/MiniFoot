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
exports.updateRoom = function(req, res) {
    Room.findOneAndUpdate({ _id: req.params.idRoom }, { $set: { message: req.body.text, createdAt: req.body.createdAt, user: req.body.user, vue: 0 } }, function (err,response) {
      if (err) {
          return res.json({ success: false, message: 'Internal Server Error.' });
      } else {
          const room = { _id: response._id, message: req.body.text, vue: 0, user : req.body.user, createdAt: req.body.createdAt, users: req.body.users };
          return res.json(room);
      }
    });
};

exports.changeRoomToVue = function (req,res) {
  Room.update( {_id: req.params.idRoom}, { $set: {user: req.body}, vue: 1 } , function(err,data) {
    if (err) {
      res.json({ success: false, message: 'Internal Server Error.' });
    }else {
      res.json(data);
    }
  });
}
