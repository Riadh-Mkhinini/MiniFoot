var Match = require('../models/Match');
var mongoose=require('mongoose');

exports.addEvents= (req, res) => {
  console.log(req.body);
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

exports.deleteEvent = (req, res) => {
  console.log(req.params.idMatch);
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
  console.log(req.body.event);
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
/*  Match.findOneAndUpdate({_id:idMatch},{"$set": { "event": req.body }},function (err,data) {
    if (err) {
      return res.json({ success: false, message: 'Events not found.' });
    } else {
        return res.json(data);
    }
  });*/
};
