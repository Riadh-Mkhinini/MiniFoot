var Advert = require('../models/Advert');

exports.getAllAdverts = (req,res) => {
  Advert.find().limit(5).skip(req.query.page * 5).sort({ createdAt: -1 }).populate
  ({
      path:'createdBy',
      select: ['_id', 'name', 'logo']
  }).exec(function(err,data) {
    if (err) {
      res.json({ success: false, message: 'Internal Server Error.' });
    }else {
      res.json(data);
    }
  });
};

exports.geAdvertsOfTeam = (req,res) => {
Advert.find({createdBy:req.params.idEquipe}).limit(5).skip(req.query.page * 5).sort({ createdAt: -1 }).populate
({
    path:'createdBy',
    select: ['_id', 'name', 'logo']
}).exec(function(err,data) {
  if (err) {
    res.json({ success: false, message: 'Internal Server Error.' });
  }else {
    res.json(data);
  }
});
};
