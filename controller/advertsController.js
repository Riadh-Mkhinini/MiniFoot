var Advert = require('../models/Advert');
var multer  = require('multer');
var path = require('path');
var fs = require('fs');

var storage = multer.diskStorage({
  destination: function (request, file, callback) {
    callback(null, './uploadEvent');
  },
  filename: function (request, file, callback) {
      const x = file.originalname.split('.');
      const imageName = `image${Date.now()}.${x[x.length - 1]}`;
      callback(null, imageName);
  }
});
var upload = multer({storage: storage}).single('photo');

exports.getPhoto=function (req, res) {
  fs.createReadStream(path.join('./uploadEvent', req.params.id)).pipe(res);
};
exports.addAdvertEvenementWithPicture=function (req, res) {
  upload(req, res, function(err) {
    if(err) {
      return err;
    }
    var advert = new Advert({
        advertEvent: {
            createdBy: req.params.id,
            title: req.body.title,
            description: req.body.description,
            image: req.file.filename,
            dateBegin: req.body.dateBegin,
            dateEnd: req.body.dateEnd,
        },
        type: 'AdvertEvent'
    });
    advert.save();
    return res.json(advert);
  });
};
exports.addAdvertEvenement=function (req, res) {
    var advert = new Advert({
        advertEvent: {
            createdBy: req.params.id,
            title: req.body.advertEvent.title,
            description: req.body.advertEvent.description,
            dateBegin: req.body.advertEvent.dateBegin,
            dateEnd: req.body.advertEvent.dateEnd,
        },
        type: 'AdvertEvent'
    });
    advert.save();
    return res.json(advert);
};

exports.getListEvents = (req, res) => {
  Advert.find({ type: 'AdvertEvent', "advertEvent.createdBy": req.params.id }).sort({ createdAt: -1 })
  .exec(function(err,data) {
    if (err) {
      return res.json({ success: false, message: 'Internal Server Error.' });
    }else {
      return res.json(data);
    }
  });
};
exports.getAllAdverts = (req, res) => {
  Advert.find().limit(5).skip(req.query.page * 5).sort({ createdAt: -1 })
  .populate
  ({
      path:'advertTeam.createdBy',
      select: ['_id', 'name', 'logo']
  })
  .populate
  ({
      path:'advertUser.createdBy',
      select: ['_id', 'firstname', 'lastname', 'photo', 'adresse', 'city', 'phone', 'email', 'equipe', 'joueur', 'equipe'],
      populate : { path : 'equipe', select: ['_id', 'name']}
  })
  .populate
  ({
      path:'advertEvent.createdBy',
      select: ['_id', 'name', 'photos']
  })
  .exec(function(err,data) {
    if (err) {
      res.json({ success: false, message: 'Internal Server Error.' });
    }else {
      res.json(data);
    }
  });
};

exports.getAllAdvertsUser = (req, res) => {
  Advert.find({ 'advertUser.createdBy': req.params.idUser }).limit(5).skip(req.query.page * 5).sort({ createdAt: -1 })
  .populate
  ({
      path:'advertUser.createdBy',
      select: ['_id', 'firstname', 'lastname', 'photo', 'adresse', 'city', 'phone', 'email', 'equipe', 'joueur']
  })
  .exec(function(err,data) {
    if (err) {
      return res.json({ success: false, message: 'Internal Server Error.' });
    }else {
      return res.json(data);
    }
  });
};
exports.geAdvertsOfTeam = (req,res) => {
Advert.find({'advertTeam.createdBy':req.params.idEquipe}).limit(5).skip(req.query.page * 5).sort({ createdAt: -1 }).populate
({
    path:'advertTeam.createdBy',
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
  Advert.findOne({ _id: req.params.idAdvert }).select('advertTeam.interested').populate
  ({
      path:'advertTeam.interested',
      select: ['_id', 'firstname', 'lastname', 'photo', 'email', 'joueur']
  }).exec(function(err,data) {
    if (err) {
      res.json({ success: false, message: 'Internal Server Error.' });
    }else {
      res.json(data);
    }
  });
};

exports.addInterrestedAdverts = (req, res) => {
  Advert.findOneAndUpdate({ _id: req.params.idAdvert }, { "$push": { "advertTeam.interested": req.query.idUser } }, function(err,advert) {
    if (err) {
      return res.json({ success: false, message: 'Internal Server Error.' });
    } else {
      res.json(advert);
    }
  });
};

exports.deleteInterrestedAdverts = (req, res) => {
  Advert.findOneAndUpdate({ _id: req.params.idAdvert }, { $pull: { "advertTeam.interested": req.query.idUser } })
  .then(function(result){
      res.json(result);
  },function(error){
      res.json(error);
  });
};

exports.deleteAdvertyId = (req, res) => {
  Advert.findByIdAndRemove(req.params.idAdvert, function(err,advert) {
    if (err) {
      return res.json({ success: false, message: 'Internal Server Error.' });
    } else {
      res.json(advert);
    }
  });
};
