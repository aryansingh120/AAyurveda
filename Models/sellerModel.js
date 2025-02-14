let mongoose=require("mongoose");
let sellerSchema=new mongoose.Schema({
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
    contact:{
        type:Number,
        required:[true,"mobile number is required"]
  
    },
    address:{
        type:String,
        required:[true,"address is required"]
    },
    storeName:{
        type:String,
        required:[true,"address is required"]
    }
    
})
module.exports=mongoose.model("sellerDetails",sellerSchema);