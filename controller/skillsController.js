var Skills = require('../models/Skills');
var mongoose=require('mongoose');

exports.addSkills=function (req,res) {
  var skill=req.body;
  var idUser=req.params.idUser;
  Skills.find({noteTo:idUser,'attaque.user': {$eq: req.query.id}}).exec(function(err,data){
    if (data.length === 0) {
      Skills.update({noteTo:idUser},
        {$push:{
          attaque:{user:req.query.id,value:skill.attaque},
          defence:{user:req.query.id,value:skill.defence},
          milieu:{user:req.query.id,value:skill.milieu},
          gardien:{user:req.query.id,value:skill.gardien},
        }
      },function(err,skills){
        if (err) {
          console.log(err);
        }
         res.send({success:true,message:'Successfully added skills.'});
      });
    }else{
      Skills.update({noteTo:idUser, 'attaque.user': { "$eq": req.query.id }}, {$set:
        { 'attaque.$.value':skill.attaque,
          'defence.$.value':skill.defence,
          'milieu.$.value':skill.attaque,
          'gardien.$.value':skill.gardien }
        },function(err,skills){
        if (err) {
          console.log(err);
        }
        res.send({success:true,message:'Successfully updated skills.'});
      });
    }
  });
};
exports.getSkills=function (req,res) {
  idUser=req.params.idUser;
  Skills.findOne({noteTo:idUser},(err,data)=>{
    if (err) {
      res.send({ success: false, message: 'Internal Server Error.' });
    }else{
      let count=0;
      let ac=0;
      let df=0;
      let mc=0;
      let gb=0;
      data.attaque.forEach((item)=> {
        count++;
        return ac +=item.value
      });
      data.defence.forEach((item)=> df +=item.value);
      data.milieu.forEach((item)=> mc +=item.value);
      data.gardien.forEach((item)=> gb +=item.value);
      let total=(((ac + df + mc + gb) / 4) / count);
      res.send({'attaque':ac/count,'defence':df/count,'milieu':mc/count,'gardien':gb/count,'total':total ,'nbrPersonne':count});
    }
  });
};
