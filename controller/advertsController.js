var Advert = require('../models/Advert');

exports.getAllAdverts = (req, res) => {
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

exports.getListInteresstedAdverts = (req, res) => {
  Advert.findOne({ _id: req.params.idAdvert }).select('interested').populate
  ({
      path:'interested',
      select: ['_id', 'firstname', 'lastname', 'photo', 'email']
  }).exec(function(err,data) {
    if (err) {
      res.json({ success: false, message: 'Internal Server Error.' });
    }else {
      res.json(data);
    }
  });
};

exports.addInterrestedAdverts = (req, res) => {
  Advert.findOneAndUpdate({ _id: req.params.idAdvert }, { "$push": { "interested": req.query.idUser } }, function(err,advert) {
    if (err) {
      return res.json({ success: false, message: 'Internal Server Error.' });
    } else {
      res.json(advert);
    }
  });
};

exports.deleteInterrestedAdverts = (req, res) => {
  Advert.findOneAndUpdate({ _id: req.params.idAdvert }, { $pull: { interested: req.query.idUser } }).then(function(result){
      res.json(result);
  },function(error){
      res.json(error);
  });
};
