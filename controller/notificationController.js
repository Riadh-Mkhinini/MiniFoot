var Notification = require('../models/Notification');
var RejoindreTeam = require('../models/RejoindreTeam');
var Equipe = require('../models/Equipe');
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

exports.getNotificationPlayerTeam = function (req, res) {
  Notification.find({ "rejoin.to": req.params.idUser }, null, { sort: { createdAt: -1 }}).populate('rejoin.from').exec(function(err,data) {
    if (err) {
      res.json({ success: false, message: 'Internal Server Error.' });
    }else {
      res.json(data);
    }
  });
};

exports.deleteNotificationPlayerTeam = function(req, res) {
  Notification.remove({ _id: req.params.idNotification }, (err,notification) => {
    if (err) {
        return res.json({ success: false, message: 'Internal Server Error.' });
    } else {
        return res.json({ success: true, message: 'success delete invitation team.' });
    }
  });
};

exports.acceptNotificationPlayerTeam = function(req, res) {
  Notification.findOneAndUpdate({ _id: req.params.idNotification }, {"$set": { "rejoin.accepted": true }}, (err,notification)=>{
    if (err) {
        return res.json({ success: false, message: 'Internal Server Error.' });
    } else {
        User.findOneAndUpdate({ _id: req.body.idUser }, {"$set": { equipe: req.body.idEquipe }}, (err,notification)=>{
          if (err) {
              return res.json({ success: false, message: 'Internal Server Error.' });
          } else {
              Equipe.findOneAndUpdate({ _id: req.body.idEquipe }, {"$push": { "joueurs": { idJoueur: req.body.idUser } }}, (err,notification)=>{
                if (err) {
                    return res.json({ success: false, message: 'Internal Server Error.' });
                } else {
                    return res.json({ success: true, message: 'Invitation accepted' });
                }
              });
          }
        });
    }
  });
};

exports.rejoindreTeam = function(req, res) {
  var rejoindreTeam = new RejoindreTeam({
      from: req.params.idUser,
      to: req.params.idEquipe
  });
  rejoindreTeam.save(function(err) {
    if (err) {
      console.log(err);
    }else{
        rejoindreTeam.save((err) => {(err) ? console.log(err) : console.log(rejoindreTeam)});
      }
      });
  };

  exports.acceptNotificationRejoindreTeam = function(req, res) {
    RejoindreTeam.findOneAndUpdate({ _id: req.params.idRejoindreTeam}, {"$set": { accepted: true }}, (err,rejoindre)=>{
      if (err) {
          return res.json({ success: false, message: 'Internal Server Error.' });
      } else {
          User.findOneAndUpdate({ _id: req.body.idUser }, {"$set": { equipe: req.body.idEquipe }}, (err,rejoindre)=>{
            if (err) {
                return res.json({ success: false, message: 'Internal Server Error.' });
            } else {
                Equipe.findOneAndUpdate({ _id: req.body.idEquipe }, {"$push": { "joueurs": { idJoueur: req.body.idUser } }}, (err,rejoindre)=>{
                  if (err) {
                      return res.json({ success: false, message: 'Internal Server Error.' });
                  } else {
                      return res.json({ success: true, message: 'Invitation accepted' });
                  }
                });
            }
          });
      }
    });
  };

exports.deleteNotificationRejoindreTeam = function(req, res) {
  RejoindreTeam.remove({ _id: req.params.idRejoindreTeam }, (err,rejoindre) => {
    if (err) {
        return res.json({ success: false, message: 'Internal Server Error.' });
    } else {
        return res.json({ success: true, message: 'success delete rejoindre team.' });
    }
  });
};

exports.getNotificationRejoindre = function (req, res) {
    RejoindreTeam.find({ to: req.params.idEquipe }, null, { sort: { createdAt: -1 }}).populate('from').exec(function(err,data) {
      if (err) {
        res.json({ success: false, message: 'Internal Server Error.' });
      }else {
        res.json(data);
      }
    });
  };

exports.getPlayerInTeam = function(req, res){
  RejoindreTeam.findOne({from: req.params.idUser,to: req.params.idEquipe}).exec(function(err,data) {
    if (err) {
      res.json({ success: false, message: 'Internal Server Error.' });
    }else if(data === null){
      res.json({ success: false, message: 'Rejoindre not found' });
    } else{
      res.json({success: true, data});
    }
  });
};
