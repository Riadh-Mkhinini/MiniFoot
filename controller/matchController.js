var Match = require('../models/Match');
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
