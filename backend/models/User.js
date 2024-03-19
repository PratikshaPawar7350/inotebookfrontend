const mongoose=require('mongoose');
const {Schema}=mongoose;

const UserSchema = new Schema({
  name:{
    type:String,required:true ,
    minlength: 3, },
password:{
        type:String,required:true ,
        minlength: 1, },
        email:{
            type:String,required:true  },
         date:{
                type:Date,default:Date.now  }

});
module.exports=mongoose.model("Users",UserSchema)