var Skills = require('../models/Skills');
exports.addSkills=function (req,res) {
  Skills.update({noteTo:req.params.idUser},{$push:{attaque:req.body.attaque,
    defence:req.body.defence,
    milieu:req.body.milieu,
    gardien:req.body.gardien}
  },function(err,skills){
    if (err) {
      console.log(err);
    }
    return res.send({ success: true, message: 'Successfully added skills.' });
  });
};
