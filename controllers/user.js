const userSchema=require("../Models/userModel");
const user2Schema=require("../Models/user2Model")
const {registerMail,storeOtp}=require("../Utils/registrationMail");
const {loginMail}=require("../Utils/loginMail")
const jwt=require("jsonwebtoken");
require("dotenv").config();
const bcrypt=require("bcrypt");
const saltRounds=10;

const signup=async(req,res)=>{
    const {fullName,email,password,confirmPassword}=req.body;
    if(!email || !fullName || !password || !confirmPassword)
        return res.status(404).send("all fields are required");

    try {
        if(password!==confirmPassword)
            return res.status(400).send("pass or confirmpass not same")
          const existinguser=await user2Schema.findOne({email});
          if(existinguser)
            return res.status(400).send("email already exist");

        
        await user2Schema.collection.drop();
         
        const hashedPassword=await bcrypt.hash(password,saltRounds)
       const createdUser={fullName,email,password:hashedPassword,otp:storeOtp};
       await user2Schema.create(createdUser);

        await registerMail(email);

       
        
    return res.status(200).send("otp sent on email")

    } catch (error) {
        return res.status(500).send({message:"internal error",error:error.message})
        
    }
}
// ***************************************************************************************
const verifyOtp=async(req,res)=>{
    const {otp}=req.body;
    if(!otp)
        return res.status(400).send("otp required");
    try {
        const user= await user2Schema.findOne({otp})
        if(!user)
            return res.status(500).send("invalid otp")
          
          const user2={
            fullName:user.fullName,
            email:user.email,
            password:user.password
          }
          await userSchema.create(user2)
          await user2Schema.collection.drop();
          return res.status(200).send("otp verification successfull");

    } catch (error) {
       return res.status(500).send({message:"otp verification failed due to internal error",findError:error.message})
        
    }

}
// ***************************************************************************
const login=async(req,res)=>{
    const {email,password}=req.body;
    if(!email)
        return res.status(400).send("email is required");
    else if(!password)
        return res.status(400).send("password is required");

    try {
        const user=await userSchema.findOne({email})   
       if(!user)
        return res.status(400).send("invalid email");

    const result=await bcrypt.compare(password,user.password)
     if(!result)
        return res.status(400).send("invalid password");

    const token = jwt.sign(
        { userId: user._id, email: user.email }, // Payload
        process.env.SECRET_KEY, // Secret Key from .env
        { expiresIn: "1h" } // Token expiry time
    );

    await loginMail(user.fullName,email)

    return res.status(200).send({message:"login successfull",token:token})
        
}catch(error){
    return res.status(500).send({message:"login failed due to internal error",error:error.message});


}
}
// ******************************************************************************  
const updateUser=async(req,res)=>{
    try{
        const userId=req.params.id;
        const updated=req.body;
        if(!userId)
            return res.status(400).send("enter user Id");

       const updatedUser= await userSchema.findByIdAndUpdate(userId,updated,{new:true,runValidators: true});
          if(!updatedUser)
        return res.status(400).send("user not found")

          return res.status(200).send("user updated successfully")


    }catch(error){
        return res.status(500).send("updation failed due to internal error");

    }
}
// ******************************************************************************
const removeUser=async(req,res)=>{
    try {
        const userId=req.params.id;
        if(!userId)
            return res.status(400).send("enter user Id");

        const deletedUser=await userSchema.findByIdAndDelete(userId);
        if(!deletedUser)
            return res.status(200).send("user not found");

        return res.status(200).send("user deleted successfully");

  

    } catch(error){
        return res.status(500).send("user not deleted due to internal error");

    }
}


module.exports={signup,verifyOtp,login,updateUser,removeUser}