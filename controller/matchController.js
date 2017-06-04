var Match = require('../models/Match');
var RejoindreTeam = require('../models/RejoindreTeam');
var mongoose=require('mongoose');

exports.addEvents= (req, res) => {
  var match = new Match(req.body);
  match.save((err) => {
   if(err){
     return res.json({success: false});
   }
     return res.json(match);
 });
};

exports.getAllEvents = (req,res) => {
  var start = new Date();
  var end = new Date();
  if (req.query.date === 'today') {
    start.setHours(0,0,0,0);
    end.setHours(23,59,59,999);
  }
    Match.find({ stade: req.params.idStade, "createdAt": { "$gte": start, "$lt": end } })
      .populate
      ({
          path:'teamOne',
          select: ['_id', 'name']
      }).populate
        ({
            path:'teamTow',
            select: ['_id', 'name']
        })
      .exec(function(err, data) {
          if (err) {
            res.status(500).send(err);
          }else {
            res.status(200).json(data);
          }
      });
};

exports.getEventReservation = (req,res) => {
    Match.find({ stade: req.params.idStade, "etat": 2 })
      .populate
      ({
          path:'teamOne',
          select: ['_id', 'name', 'logo']
      }).populate
        ({
            path:'teamTow',
            select: ['_id', 'name', 'logo']
        })
      .exec(function(err, data) {
          if (err) {
            res.status(500).send(err);
          }else {
            res.status(200).json(data);
          }
      });
};

exports.deleteEvent = (req, res) => {
  idMatch = req.params.idMatch ;
  Match.remove({ _id: idMatch }, (err,data) => {
    if (err) {
        return res.json({ success: false, message: 'Internal Server Error.' });
    } else {
       return res.json({ success: true, message: 'success delete match.' });
    }
  });
};

exports.updateEvent = (req, res) => {
  idMatch = req.params.idMatch ;
  Match.findById(idMatch,function(err,data){
    if(err){
        res.status(500).send(err);
    }
    else{
      data.event.start = req.body.event.start;
      data.event.end = req.body.event.end;
      data.save();
      res.json(data);
    }
  });
};

exports.getMesMatchs = (req, res) => {
    var date = req.query.date;
    var dateParts = date.split("/");
    var start = new Date(dateParts[2], dateParts[1] - 1, dateParts[0]);
    var end = new Date(dateParts[2], dateParts[1] - 1, dateParts[0]);
    start.setHours(0,0,0,0);
    end.setHours(23,59,59,999);
    Match.update({ $or: [{ teamOne :req.params.idEquipe }, { teamTow :req.params.idEquipe }], etat: 3,
                  'event.start': { "$gte": start, "$lt": end } }, { $set: { etat: 4 }})
                  .exec(function(err, data) {
      if (err) {
        return res.status(200).send(err);
      } else {
          Match.find({$or: [{ teamOne :req.params.idEquipe }, { teamTow :req.params.idEquipe }], etat: { $ne: 5 }})
            .limit(5).skip(req.query.page * 5).sort({ createdAt: -1 })
            .populate
            ({
              path: 'teamOne',
              select: ['_id', 'name', 'logo']
            })
            .populate
              ({
                path: 'teamTow',
                select: ['_id', 'name', 'logo']
              })
            .populate
              ({
                path: 'stade',
                select: ['_id', 'name', 'logo', 'photos', 'latitude', 'longitude']
              })
            .exec(function(err,data) {
            if (err) {
              return res.json({ success: false, message: 'Internal Server Error.' });
            } else {
              return res.json(data);
            }
          });
      }
    });
};

exports.getMatchsMyEquipe = (req, res) => {
    var date = req.query.date;
    var dateParts = date.split("/");
    var start = new Date(dateParts[2], dateParts[1] - 1, dateParts[0]);
    var end = new Date(dateParts[2], dateParts[1] - 1, dateParts[0]);
    start.setHours(0,0,0,0);
    end.setHours(23,59,59,999);
    Match.update({ $or: [{ teamOne :req.params.idEquipe }, { teamTow :req.params.idEquipe }], etat: 3,
                  'event.start': { "$gte": start, "$lt": end } }, { $set: { etat: 4 }})
                  .exec(function(err, data) {
      if (err) {
        return res.status(200).send(err);
      } else {
          Match.find({$or: [{ teamOne :req.params.idEquipe }, { teamTow :req.params.idEquipe }], etat: { $gte: 1 }})
            .limit(5).skip(req.query.page * 5).sort({ createdAt: -1 })
            .populate
            ({
              path: 'teamOne',
              select: ['_id', 'name', 'logo']
            })
            .populate
              ({
                path: 'teamTow',
                select: ['_id', 'name', 'logo']
              })
            .populate
              ({
                path: 'stade',
                select: ['_id', 'name', 'logo', 'photos', 'latitude', 'longitude']
              })
            .exec(function(err,data) {
            if (err) {
              return res.json({ success: false, message: 'Internal Server Error.' });
            } else {
              return res.json(data);
            }
          });
      }
    });
};
exports.getMatchsTeamTerminated = (req, res) => {
  Match.find({$or: [{ teamOne :req.params.idEquipe }, { teamTow :req.params.idEquipe }], etat: 5 })
    .sort({ createdAt: -1 })
    .populate
    ({
      path: 'teamOne',
      select: ['_id', 'name', 'logo']
    })
    .populate
      ({
        path: 'teamTow',
        select: ['_id', 'name', 'logo']
      })
    .exec(function(err,data) {
    if (err) {
      return res.json({ success: false, message: 'Internal Server Error.' });
    } else {
      return res.json(data);
    }
  });
};
exports.deleteMatchById = function(req, res) {
  Match.remove({ _id: req.params.idMatch }, (err, match) => {
    if (err) {
      return res.json({ success: false, message: 'Internal Server Error.' });
    } else {
      RejoindreTeam.findOneAndRemove({ "joinMatch.match": req.params.idMatch, "joinMatch.accepted": false }, function(err, rejoindre) {
        if (err) {
          return res.json({ success: false, message: 'Internal Server Error.' });
        } else {
          return res.json({ success: true, message: 'success delete match .' });
        }
      });
    }
  });
};

exports.acceptMatchById = function(req, res) {
    Match.findOneAndUpdate({ _id: req.params.idMatch }, { $set: { etat: 1 } }, function (err,response) {
      if (err) {
        return res.json({ success: false, message: 'Match not found.' });
      } else {
          RejoindreTeam.findOneAndUpdate({ "joinMatch.match": req.params.idMatch, "joinMatch.accepted": false }, { $set: { 'joinMatch.accepted': true } }, function(err, rejoindre) {
            if (err) {
              return res.json({ success: false, message: 'Internal Server Error.' });
            } else {
              return res.json({ success: true, message: 'success accepted match .' });
            }
          });
      }
    });
};

exports.reserverStade = (req,res) => {
    Match.findOneAndUpdate({ _id: req.params.idMatch },
      { $set:{ etat: 2, date: req.body.date, message: req.body.message }}, function(err, data){
      if (err) {
        console.log(err);
      }
       return res.send({ success:true, message:'Match envoyé au responsable de stade en attent ça réponse.'});
    });
};

exports.addScoreMatch = (req,res) => {
    Match.findOneAndUpdate({ _id: req.params.idMatch },
      { $set:{ etat: 5, scoreOne: req.body.scoreOne, scoreTow: req.body.scoreTow }}, function(err, data){
      if (err) {
        console.log(err);
      }
       return res.send({ success:true, message:'score ajouter avec succssée'});
    });
};

exports.acceptReservation = (req, res) => {
  idMatch = req.params.idMatch ;
  Match.findOneAndUpdate({_id: idMatch},{"$set":{etat: 3, event: { start: req.body.event.start, end: req.body.event.end }}},function (err,response) {
    if (err) {
      return res.json({ success: false, message: 'Match not found.' });
    } else {
        return res.json({ success: true, message: response});
    }
  });
};
