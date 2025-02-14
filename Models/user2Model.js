let mongoose=require("mongoose");
let user2Schema=new mongoose.Schema({
   fullName:{
      type:String,
      required:[true,"username is required"],
      trim:true
  },
  email:{
      type:String,
      required:[true,"email is required"],
      unique:true,
      lowercase:true
  },
  password:{
      type:String,
      required:[true,"password is required"],
      minlength:[6,"password must be at 6 characters"]
  },
  otp:{
   type:Number,
   required:true
  }
})
module.exports=mongoose.model("user2",user2Schema);