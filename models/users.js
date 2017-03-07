var mongoose=require('mongoose');
var bcrypt=require('bcrypt-nodejs');

var userSchema=new mongoose.Schema({
  email:{
    type:String,
    unique:true,
    required:true
  },
  password:{
    type:String,
    required:true
  },
  role:{
    type:String,
    enume:['Joueur','Manager'],
    default:'Joueur'
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
