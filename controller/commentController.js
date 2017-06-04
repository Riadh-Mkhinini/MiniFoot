var Comment = require('../models/Comment');
var mongoose=require('mongoose');

exports.getListComment= (req, res) => {
    Comment.find({ advert: req.params.idAdvert }).sort({ createdAt: -1 })
    .limit(5).skip(req.query.page * 5)
    .populate
    ({
        path:'postedBy',
        select: ['_id', 'firstname', 'lastname', 'photo'],
    })
    .exec(function(err,data) {
      if (err) {
        return res.json({ success: false, message: 'Internal Server Error.' });
      }else {
        return res.json(data);
      }
    });
};
exports.addCommentAdvertEvenement=function (req, res) {
    console.log('req.body');
    var comment = new Comment(req.body);
    comment.save((err) => {
      if(err){
        return res.json({success: false});
      }
        return res.json(comment);
    });
};
exports.deleteCommentAdvert = (req, res) => {
    Comment.findByIdAndRemove(req.params.idComment, function (err, comment) {
      if (err) {
        return res.json({ "message": "comment not found" });
      } else {
        return res.json(comment);
      }
    });
};
