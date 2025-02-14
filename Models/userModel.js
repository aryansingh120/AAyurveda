let mongoose=require("mongoose");
let userSchema=new mongoose.Schema({
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
    }
    
})
module.exports=mongoose.model("userDetails",userSchema);