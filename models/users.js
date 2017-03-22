var mongoose=require('mongoose');
var bcrypt=require('bcrypt-nodejs');

var userSchema=new mongoose.Schema({
  firstname:{type:String, required:true},
  lastname:{type:String, required:true},
  adresse:String,
  city:String,
  photo:String,
  phone:Number,
  email:{type:String,unique:true,required:true},
  password:{type:String,required:true},
  role:{type:String,enume:['Joueur','Manager'],default:'Joueur'},
  joueur:{
      poste:String,
      taille:Number,
      poid:Number,
      age :Number,
      type:{type:String,enume:['Joueur','Responsable','Adjoint'],default:'Joueur'}
  }
});

//generating a hash
userSchema.methods.generateHash=function(password){
  return bcrypt.hashSync(password,bcrypt.genSaltSync(8),null);
};
// checking is passord is valide
userSchema.methods.validPassword=function(password){
  return bcrypt.compareSync(password,this.password);
};

var modelUser=mongoose.model("User",userSchema);
module.exports = modelUser;
